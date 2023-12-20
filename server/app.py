#!/usr/bin/env python3
from flask import Flask, request, abort, make_response
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from flask import session
from flask import jsonify
from sqlalchemy.orm.exc import NoResultFound
from flask_bcrypt import Bcrypt
from sqlalchemy import or_

from config import app, db
api = Api(app)
bcrypt = Bcrypt(app)

from models import User   
from models import Artwork
from models import Tag
from models import DiscussionPost
from models import Comment
from models import ArtworkTag
from models import PostTag

@app.route('/')
def index():
    return '<h1>The Project Server</h1>'
class AuthenticatedResource(Resource):
    def check_authentication(self):
        if 'user_id' not in session:
            abort(401, description='User not logged in')      
class Users(Resource):
    def get(self):
        try:
            users = User.query.all()
            user_list = [user.to_dict() for user in users]
            return {'users': user_list}, 200
        except Exception as e:
            return {'error': str(e)}, 500
api.add_resource(Users, "/users")
class UserById(AuthenticatedResource):
    def get(self, user_id):
        requested_user_id = int(user_id)
        authenticated_user_id = session.get('user_id')

        if authenticated_user_id and requested_user_id == authenticated_user_id:
            user = User.query.get_or_404(requested_user_id, description=f"User {user_id} not found")
            return user.to_dict(rules=("-password", "-email", "bio", "artworks", "discussion_posts")), 200
        else:
            try:
                user = User.query.filter_by(user_id=requested_user_id).one()
                return user.to_dict(only=("username", "bio", "created_at", "updated_at", "artworks", "discussion_posts")), 200
            except ValueError:
                return {'error': f'User with ID {user_id} not found'}, 404

    def patch(self, user_id):
        requested_user_id = int(user_id)
        authenticated_user_id = session.get('user_id')
        if authenticated_user_id and requested_user_id == authenticated_user_id:
            try:
                user = User.query.get_or_404(requested_user_id, description=f"User {user_id} not found")
                data = request.get_json()
                for key, value in data.items():
                    setattr(user, key, value)
                db.session.commit()
                return user.to_dict(), 200
            except Exception as e:
                db.session.rollback()
                return {'error': str(e)}, 400
        else:
            return {'error': 'You do not have permission to modify this user'}, 403
        
    def delete(self, user_id):
        requested_user_id = int(user_id)
        authenticated_user_id = session.get('user_id')

        if authenticated_user_id and requested_user_id == authenticated_user_id:
            try:
                user = User.query.get_or_404(requested_user_id, description=f"User {user_id} not found")
                db.session.delete(user)
                db.session.commit()
                return {}, 204
            except Exception as e:
                db.session.rollback()
                return {'error': str(e)}, 400
        else:
            return {'error': 'You do not have permission to delete this user'}, 403

api.add_resource(UserById, "/users/<int:user_id>")
class UpdatePassword(AuthenticatedResource):
    def patch(self, user_id):
        self.check_authentication()
        authenticated_user_id = session.get('user_id')
        if authenticated_user_id != int(user_id):
            abort(403, description='You do not have permission to modify this user')

        user = User.query.get_or_404(user_id, description=f"User {user_id} not found")
        data = request.get_json()
        hashed_password = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
        user.password = hashed_password
        db.session.commit()
        return {}, 200

api.add_resource(UpdatePassword, "/users/<int:user_id>/updatePassword")
class NewUser(Resource):
  def post(self):
        try:
            data = request.get_json()
            new_user = User(
                username=data.get('username'),
                email=data.get('email'),
                bio=data.get('bio')
            )
            new_user.password = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
            db.session.add(new_user)
            db.session.commit()
            return new_user.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400
        
api.add_resource(NewUser, "/register")

class Login(Resource):
     def post(self):
        try:
            data = request.get_json()
            username_or_email = data.get('username')
            print(f"Attempting login for {username_or_email}")

            user = User.query.filter(
                (User.username == username_or_email) | (User.email == username_or_email)
            ).first()

            if user and bcrypt.check_password_hash(user.password, data.get('password')):
                session['user_id'] = user.user_id
                session.permanent = True
                print("Login successful")
                return user.to_dict(), 200

            print("Invalid credentials")
            return {'message': 'Invalid Credentials'}, 403
        except Exception as e:
            print(f"Exception: {e}")
            return {'message': 'Invalid Credentials'}, 403

api.add_resource(Login, "/login")
class Logout(Resource):
    def delete(self):
        session.clear()
        #if "user_id" in session:
         #   del session["user_id"]
        return {}, 204

api.add_resource(Logout, '/logout')
class Artworks(AuthenticatedResource):
    def get(self):
        try:
            artworks = [artwork.to_dict() for artwork in Artwork.query.all()]
            return artworks, 200
        except Exception as e:
            return {'message': str(e)}, 400
        
    def post(self):
        self.check_authentication()
        user_id = session['user_id']
        title = request.json.get('title')
        image_url = request.json.get('image_url')
        tags = request.json.get('tags')
        print(request.json)
        try:
            new_artwork = Artwork(
              title=title,
              image_url=image_url,
              user_id=user_id
            )
            db.session.add(new_artwork)
         #  # db.session.flush()
            db.session.commit()
            for tag_id in tags:
             #tag = Tag.query.get(tag_id)
             tag = db.session.get(Tag, tag_id)
             if  tag: 
                    #post_tag = PostTag(post=new_post, tag=tag)
                    #artwork_tag = ArtworkTag(artwork_id=new_artwork.artwork_id, tag_id=tag.tag_id)
                artwork_tag = ArtworkTag(artwork_id=new_artwork.artwork_id, tag_id=tag_id)
                db.session.add(artwork_tag)
                db.session.commit()
              
            return new_artwork.to_dict(), 201
        except Exception as e: 
            db.session.rollback()
            return {'message': str(e)}, 400
        
api.add_resource(Artworks, "/artworks")
class ArtworkById(Resource):
    def get(self, artwork_id):
        try: 
            artwork = Artwork.query.get_or_404(artwork_id, description=f"Artwork {artwork_id} not found" )
            return artwork.to_dict(), 200
        except Exception as e:
            return {'message': str(e)}, 400

api.add_resource(ArtworkById, "/artworks/<int:artwork_id>")
class EditArtwork(AuthenticatedResource):
    def _check_permission(self, artwork):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'User not logged in'}, 401
        if artwork.user_id != user_id:
            return {'error': 'You do not have permission to modify this artwork'}, 403
        return None

    def patch(self, artwork_id):
        self.check_authentication()
        artwork = Artwork.query.get_or_404(artwork_id, description=f"Artwork {artwork_id} not found")
        permission_error = self._check_permission(artwork)
        if permission_error:
            return permission_error
        try:
            data = request.get_json()
            for k, v in data.items():
                setattr(artwork, k, v)
            db.session.commit()
            return artwork.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

    def delete(self, artwork_id):
        self.check_authentication()
        artwork = Artwork.query.get_or_404(artwork_id, description=f"Artwork {artwork_id} not found")
        permission_error = self._check_permission(artwork)
        if permission_error:
            return permission_error
        try:
            db.session.delete(artwork)
            db.session.commit()
            return {}, 204
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(EditArtwork, "/artworks/<int:artwork_id>")
class DiscussionPosts(AuthenticatedResource):
    def get(self):
        try:
            discussion_posts = [post.to_dict() for post in DiscussionPost.query.all()]
            return discussion_posts, 200
        except Exception as e:
            return {'message': str(e)}, 400

    def post(self):
        self.check_authentication()
        user_id = session['user_id']
        title = request.json.get('title')
        body = request.json.get('body')
        post_tags = request.json.get('tags')
        if not title or not isinstance(title, str):
            return {'error': 'Title is required and must be a string'}, 400
        if not body or not isinstance(body, str):
            return {'error': 'Body text is required and must be a string'}, 400
        if not post_tags or not isinstance(post_tags, list) or len(post_tags) == 0:
            return {'error': 'At least one tag is required'}, 400
        try:
            new_post = DiscussionPost(
                title=title,
                body=body,
                user_id=user_id
            )
            db.session.add(new_post)
            db.session.commit()
            for tag_id in post_tags:
                tag = db.session.get(Tag,tag_id)
                if tag: 
                    
                    post_tag = PostTag(post=new_post, tag=tag)
                    db.session.add(post_tag)
            db.session.commit()
            return new_post.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400
api.add_resource(DiscussionPosts, "/discussion-posts")
class DiscussionPostById(Resource):
    def get(self, post_id):
        try:
            discussion_post = DiscussionPost.query.get_or_404(post_id, description=f"Discussion Post {post_id} not found!")
            comments = [comment.to_dict() for comment in discussion_post.comments]
            return {'discussion_post': discussion_post.to_dict(), 'comments': comments}, 200
        except Exception as e:
            return {'message': str(e)}, 400

api.add_resource(DiscussionPostById, "/discussion-posts/<int:post_id>")
class EditDiscussionPosts(AuthenticatedResource):
    def patch(self, post_id):
        self.check_authentication()
        user_id = session['user_id']
        discussion_post = DiscussionPost.query.get_or_404(post_id, description=f"Discussion Post {post_id} not found")
        if discussion_post.user_id != user_id:
            return {'error': 'You do not have permission to edit this discussion post'}, 403
        try:
            data = request.get_json()
            for k, v in data.items():
                setattr(discussion_post, k, v)
            db.session.commit()
            return discussion_post.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'error': f"Failed to edit discussion post: {str(e)}"}, 400

    def delete(self, post_id):
        self.check_authentication()
        user_id = session['user_id']
        discussion_post = DiscussionPost.query.get_or_404(post_id, description=f"Discussion Post {post_id} not found")
        if discussion_post.user_id != user_id:
            return {'error': 'You do not have permission to delete this discussion post'}, 403
        try:
            db.session.delete(discussion_post)
            db.session.commit()
            return {}, 204
        except Exception as e:
            db.session.rollback()
            return {'error': f"Failed to delete discussion post: {str(e)}"}, 400 
api.add_resource(EditDiscussionPosts, "/discussion-posts/<int:post_id>")      
class DiscussionPostDetail(Resource):
    def get(self, post_id):
        post = DiscussionPost.query.get_or_404(post_id, description=f'Discussion Post {post_id} not found')
        return post.to_dict(), 200

api.add_resource(DiscussionPostDetail, '/discussion-posts/<int:post_id>')
class CommentsByPostId(AuthenticatedResource):
    def get(self, post_id):
        try:
            comments = db.session.query(Comment, User.username).join(User).filter(Comment.post_id == post_id).all()
            comments_data = [{'comment_id': comment.comment_id,
                              'content': comment.content,
                              'created_at': comment.created_at.isoformat(),
                              'user_id': comment.user_id,
                              'username': username,
                              'post_id': comment.post_id}
                             for comment, username in comments]
            return {'comments': comments_data}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    def post(self, post_id):
        self.check_authentication()
        user_id = session['user_id']
        content = request.json.get('content')
        if not content:
            return {'error': 'Content is required'}, 400
        try:
            new_comment = Comment(
                content=content,
                user_id=user_id,
                post_id=post_id
            )
            db.session.add(new_comment)
            db.session.commit()
            return new_comment.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

    @staticmethod
    def convert_to_dict(comment):
        return {
            'comment_id': comment.comment_id,
            'content': comment.content,
            'created_at': comment.created_at.isoformat(),
            'user_id': comment.user_id,
            'post_id': comment.post_id
        }
api.add_resource(CommentsByPostId, "/discussion-post/<int:post_id>/comments")
class DeleteComment(AuthenticatedResource):
    def delete(self, comment_id):
        self.check_authentication()
        user_id = session['user_id']
        comment = Comment.query.get_or_404(comment_id, description=f"Comment {comment_id} not found")
        if comment.user_id != user_id:
            return {'error': 'You do not have permission to delete this comment'}, 403
        try:
            db.session.delete(comment)
            db.session.commit()
            return {}, 204
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(DeleteComment, '/comments/<int:comment_id>')
class Tags(Resource):
    def get(self):
        tags = Tag.query.all()
        tag_list = [tag.to_dict(only=("tag_id","title")) for tag in tags]
        return tag_list, 200
api.add_resource(Tags, "/tags")
class CheckSession(Resource): 
    def get(self):
        if "user_id" not in session:
            return {"message": "Not Authorized"}, 403
        user = db.session.query(User).get(session["user_id"])
        if user:
            return user.to_dict(rules=("-email", "bio")), 200
        return {"message": "Not Authorized"}, 403
api.add_resource(CheckSession, '/check_session')
class NewestArt(Resource):
    def get(self):
        try:
            newest_artworks = (
                db.session.query(Artwork)
                .order_by(Artwork.created_at.desc())
                .limit(5)
                .all()
            )
            newest_artworks_list = [artwork.to_dict() for artwork in newest_artworks]
            return newest_artworks_list, 200
        except Exception as e:
            return {'error': str(e)}, 500
api.add_resource(NewestArt, '/newestArt')
class NewestPostsResource(Resource):
    def get(self):
        try:
            artwork_posts = Artwork.query.order_by(Artwork.created_at.desc()).limit(5).all()
            discussion_posts = DiscussionPost.query.order_by(DiscussionPost.created_at.desc()).limit(5).all()

            all_posts = sorted(artwork_posts + discussion_posts, key=lambda post: post.created_at, reverse=True)
            posts_data = [post.to_dict() for post in all_posts]

            return jsonify(posts_data), 200
        except Exception as e:
            return {'error': str(e)}, 500

api.add_resource(NewestPostsResource, '/newestPosts')
class SearchAPI(Resource):
    def get(self):
        query = request.args.get('query', '')
        tag = request.args.get('tag', '')
        results = {
            'users': [],
            'artworks': [],
            'discussion_posts': []
        }
        if query:
           results['users'] = User.query.filter(User.username.ilike(f'%{query}%')).all()
           results['artworks'] = Artwork.query.filter(Artwork.title.ilike(f'%{query}%')).all()
           results['discussion_posts'] = DiscussionPost.query.filter(DiscussionPost.title.ilike(f'%{query}%')).all()
        if tag:
               # Filter artworks by tag
            results['artworks'] = Artwork.query \
                .join(Artwork.artwork_tags) \
                .join(Tag, ArtworkTag.tag_id == Tag.tag_id) \
                .filter(Tag.title.ilike(f'%{tag}%')) \
                .filter(Artwork.title.ilike(f'%{query}%')) \
                .all()

            # Filter discussion posts by tag
            results['discussion_posts'] = DiscussionPost.query \
                .join(DiscussionPost.post_tags) \
                .join(Tag, PostTag.tag_id == Tag.tag_id) \
                .filter(Tag.title.ilike(f'%{tag}%')) \
                .filter(DiscussionPost.title.ilike(f'%{query}%')) \
                .all()
            
        results_list = {
            'users': [user.to_dict() for user in results['users']],
            'artworks': [artwork.to_dict() for artwork in results['artworks']],
            'discussion_posts': [post.to_dict() for post in results['discussion_posts']]
        }

        return results_list

api.add_resource(SearchAPI, '/search')

if __name__ == '__main__':
    app.run(port=5555, debug=True)