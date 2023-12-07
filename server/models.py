from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

# Models go here!
# 
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
   
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False) ##to be hashed later
    bio = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
   
    # Relationships
    artworks = db.relationship('Artwork', back_populates='user', cascade="all, delete-orphan")
    discussion_posts = db.relationship('DiscussionPost', back_populates='user', cascade="all, delete-orphan")
    comments = db.relationship('Comment', back_populates='user', cascade="all, delete-orphan")
   
    #serialize_rules
    serialize_rules = ("-artworks.user", "-discussion_posts.user","-comments.user")
    # exclude user field in artworks relationship
    #exclude user field in discussion_posts and comments relationships
   
   
    def __repr__(self):
        return f'<User(user_id={self.user_id}, username={self.username})>'
    
class Artwork(db.Model, SerializerMixin):
    __tablename__ = 'artworks'
   
    artwork_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    image_file_path = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    #tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'))
    # Relationships
    artwork_tags = db.relationship('ArtworkTag', back_populates='artwork', cascade="all, delete-orphan")
    tags = association_proxy('artwork_tag', 'tag')
    user = db.relationship('User', back_populates='artworks')

    #serialization rules
    serialize_rules = ("-user.artworks", "-artwork_tags.artwork") # exclude artworks field in user relationship
   

    def __repr__(self):
        return f'<Artwork(artwork_id={self.artwork_id}, title={self.title})>'
    
class DiscussionPost(db.Model, SerializerMixin):
    __tablename__ = 'discussion_posts'
   
    post_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
   
    # Relationships
    post_tags = db.relationship('PostTag', back_populates='post', cascade="all, delete-orphan")
    tags = association_proxy('post_tags','tag')
    comments = db.relationship('Comment', back_populates='discussion_post', cascade="all, delete-orphan" )
    user = db.relationship('User', back_populates='discussion_posts')
    #serialize_rule
    serialize_rules = ("-user.discussion_posts")
    #exclude discussion_posts and comments fields in user relationships

    def __repr__(self):
        return f'<DiscussionPost(post_id={self.post_id}, title={self.title})>'
    
class Tag(db.Model, SerializerMixin):
    __tablename__ = 'tags'
   
    tag_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
   
    #relationships
    artwork_tags = db.relationship('ArtworkTag', back_populates='tag', cascade="all, delete-orphan")
    post_tags = db.relationship('PostTag', back_populates='tag', cascade="all, delete-orphan")
    
    #serialization rules
    serialize_rules = ("-artwork_tags.tag", "post_tags.tag",)
    #exclude tag field in artwork_tags relationship
    #exclude tag field in post_tags relationship
   
    def __repr__(self):
        return f'<Tag(tag_id={self.tag_id}, title={self.title})>'

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'
   
    comment_id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('discussion_posts.post_id'), nullable=False)
    
    # Relationships
    user = db.relationship('User', back_populates='comments')
    discussion_post = db.relationship('DiscussionPost', back_populates='comments')
   
    #serialize rules
    serialize_rules = ("-user.comments", "-discussion_post.comments",)
    #exclude comments field in user relationship
    #exclude comments field in discussion_post relationship
    def __repr__(self):
        return f'<Comment(comment_id={self.comment_id}, content={self.content})>'
    
class ArtworkTag(db.Model, SerializerMixin):
    __tablename__ = 'artwork_tags'
   
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), primary_key=True)
    artwork_id = db.Column(db.Integer, db.ForeignKey('artworks.artwork_id'), primary_key=True, nullable=False)
    artwork = db.relationship('Artwork', back_populates='artwork_tags')
    tag = db.relationship('Tag', back_populates='artwork_tags')
    #serialization rules
    serialize_rules = ("-artwork.tag",) #exclude tag field in artwork relationship
   
    def __repr__(self):
        return f'<ArtworkTag(tag_id={self.tag_id}, artwork_id={self.artwork_id})>'

class PostTag(db.Model, SerializerMixin):
    __tablename__ = 'post_tags'
   
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), primary_key=True, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('discussion_posts.post_id'), primary_key=True, nullable=False)
    post = db.relationship('DiscussionPost', back_populates='post_tags')
    tag = db.relationship('Tag', back_populates='post_tags')
   
    #serialization rules
    serialize_rules = ("-post.tag",) #exclude tag field in post relationship