#!/usr/bin/env python3
from flask import Flask, request
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from flask import session
from sqlalchemy.orm.exc import NoResultFound

# Local imports
from config import app, db
api = Api(app)

# Add your model imports
from models import User   
from models import Artwork
from models import Tag
from models import DiscussionPost
from models import Comment
from models import ArtworkTag
from models import PostTag

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class UserById(Resource):
    def get(self, user_id):
        try: 
            user = User.query.filter_by(user_id=user_id).one()
            return user.to_dict(only=("username", "email", "bio", "created_at", "updated_at")), 200
        except ValueError:
            return {'error': f'User with ID{user_id} not found'}, 404
        
    def patch(self, user_id):
        try: 
            user = User.query.get_or_404(user_id, description=f"User{user_id} not found")
            data = request.get_json()
            for key, value in data.items():
                setattr(user, key, value)
            db.session.commit()
            return user.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return{'error': str(e)}, 400
        
api.add_resource(UserById, "/users/<int:user_id>")

class NewUser(Resource):
    def post(self):
        try:
            data = request.get_json()
            new_user = User(
                username=data.get('username'),
                email=data.get('email'),
                bio=data.get('bio')
            )
            new_user.password = data.get('password')
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

            if user and user.authenticate(data.get('password')):
                session['user_id'] = user.user_id
                print("Login successful")
                return {'message': 'Login successful', 'user_id': user.user_id}, 200

            print("Invalid credentials")
            return {'message': 'Invalid Credentials'}, 403
        except Exception as e:
            print(f"Exception: {e}")
            return {'message': 'Invalid Credentials'}, 403
api.add_resource(Login, "/login")

class Artworks(Resource):
    def get(self):
        try:
            artworks = [artwork.to_dict() for artwork in Artwork.query.all()]
            return artworks, 200
        except Exception as e:
            return {'message': str(e)}, 400
        
    def post(self):
        if 'user_id' not in session:
            return {'error': 'User not logged in'}, 401
        user_id = session['user_id']
        title = request.json.get('title')
        image_file_path = request.json.get('image_file_path')
        tags = request.json.get('tags')
        try:
            new_artwork = Artwork(
                title=title,
                image_file_path=image_file_path,
                user_id=user_id
            )
            db.session.add(new_artwork)
            db.session.commit()
            for tag_name in tags:
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag: 
                    tag = Tag(name=tag_name)
                    db.session.add(tag)
                artwork_tag = ArtworkTag(artwork=new_artwork, tag_id=tag.tag_id)
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

class EditArtwork(Resource):
    def _check_permission(self, artwork):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'User not logged in'}, 401
        if artwork.user_id != user_id:
            return {'error': 'You do not have permission to modify this artwork'}, 403
        return None

    def patch(self, artwork_id):
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

class DiscussionPosts(Resource):
    def get(self):
        try:
            discussion_posts = [post.to_dict() for post in DiscussionPost.query.all()]
            return discussion_posts, 200
        except Exception as e:
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
class CreateDiscussionPost(Resource):
    def post(self):
        if 'user_id' not in session:
            return {'error': 'User not logged in'}, 401
        user_id = session['user_id']
        title = request.json.get('title')
        body = request.json.get('body')
        post_tags = request.json.get('post_tags')
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

            return new_post.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(DiscussionPosts, "/discussion-posts")
class EditDiscussionPosts(Resource):
    def patch(self, id):
        if 'user_id' not in session:
            return {'error': 'User not logged in'}, 401
        
        user_id = session['user_id']
        discussion_post = DiscussionPost.query.get_or_404(id,
            description=f"Discussion Post {id} not found")
        
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
            return {'message': str(e)}, 400
    
    def delete(self, id):
        if 'user_id' not in session: 
            return {'error': 'User not logged in'}, 401
        
        user_id = session['user_id']
        discussion_post = DiscussionPost.query.get_or_404(id,
            description=f"Discussion Post {id} not found")
        
        if discussion_post.user_id != user_id:
            return {'error': 'You do not have permission to delete this discussion post'}, 403
        
        try: 
            db.session.delete(discussion_post)
            db.session.commit()
            return {}, 204
        except Exception as e: 
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(EditDiscussionPosts, "/discussion-posts/<int:id>")      
class Comment(Resource):
      def post(self):

        if 'user_id' not in session:
            return {'error': 'User not logged in'}, 401
        
        user_id = session['user_id']

        data = request.get_json()

        if 'content' not in data or 'post_id' not in data:
            return {'error': 'Content and post_id are required'}, 400

        content = data['content']
        post_id = data['post_id']

        try:
            discussion_post = DiscussionPost.query.get(post_id)
        except NoResultFound:
            return {'error': 'Discussion post not found'}, 404
        new_comment = Comment(content=content, user_id=user_id, post_id=post_id)
        try:
            db.session.add(new_comment)
            db.session.commit()
            return new_comment.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400
        
api.add_resource(Comment, "/comments")
class DiscussionPostById(Resource):
    def get(self, post_id):
        try:
            discussion_post = DiscussionPost.query.get_or_404(post_id, description=f"Discussion Post {post_id} not found!")
            comments = [comment.to_dict() for comment in discussion_post.comments]
            return {'discussion_post': discussion_post.to_dict(), 'comments': comments}, 200
        except Exception as e:
            return {'message': str(e)}, 400

api.add_resource(DiscussionPostById, "/discussion-posts/<int:post_id>")
class DeleteComment(Resource):
    def delete(self, comment_id):
        if 'user_id' not in session:
            return {'error': 'User not logged in'}, 401
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

if __name__ == '__main__':
    app.run(port=5555, debug=True)