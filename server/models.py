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
   
    @validates("username")
    def validate_username(self, _, username):
        if not isinstance(username, str):
            raise TypeError("Username must be a string")
        elif len(username) < 1:
            raise ValueError("Username must be at least 1 character")
        return username
    
    @validates("email")
    def validate_email(self, _, email):
       if not isinstance(email, str):
            raise TypeError("Email must be a string")
       elif len(email) < 1:
           raise ValueError("Email must be at least 1 character")
       elif not "@" in email or not "." in email:
            raise ValueError("Invalid email format")
       return email
    
    @validates("password")
    def validate_password(self, _, password):
        if not isinstance(password, str):
            raise TypeError("Password must be a string")
        elif len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        return (password)
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

    #trying out a custom to_dict method to try to stop recursion 
    #def to_dict(self):
        #data = super(Artwork, self).to_dict(
           #serialize_only=(
                #'artwork_id',
                #'title',
               # 'created_at',
               # 'updated_at',
                #'image_file_path',
                #'user_id'
            #)
       #)
       # return data # trying to specify exactly what I want 
    #serialization rules
    serialize_rules = ("-user.artworks", "-artwork_tags.artwork") # exclude artworks field in user relationship
   
    @validates("image_file_path")
    def validate_image_file_path(self, _, image_file_path):
        if not isinstance(image_file_path, str):
            raise TypeError("Image file path must be a string")
        elif not image_file_path:
            raise ValueError("Image file path is required")
        return image_file_path

    @validates("artwork_tags")
    def validate_artwork_tags(self, _, artwork_tags):
        if not artwork_tags:
            raise ValueError("At least one tag is required")
        return artwork_tags

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
    
    @validates("body")
    def validate_body(self, _, body):
        if not body or not isinstance(body, str):
            raise ValueError("Body text is required")
        return body
    
    @validates("post_tags")
    def validate_post_tags(self, _, post_tags):
        if not post_tags:
            raise ValueError("At least one tag is required")
        return post_tags

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
    serialize_rules = ("-artwork.tag","-tag.artwork_tags") #exclude tag field in artwork relationship
                                                            # trying -tag.artwork_tag for circular issues excluding tag field in artwork relationship  
    def __repr__(self):
        return f'<ArtworkTag(tag_id={self.tag_id}, artwork_id={self.artwork_id})>'

class PostTag(db.Model, SerializerMixin):
    __tablename__ = 'post_tags'
   
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), primary_key=True, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('discussion_posts.post_id'), primary_key=True, nullable=False)
    post = db.relationship('DiscussionPost', back_populates='post_tags')
    tag = db.relationship('Tag', back_populates='post_tags')
   
    #serialization rules
    serialize_rules = ("-post.tag", "-tag.post_tags") #exclude tag field in post relationship
                                                     #trying -tag.post_tags for circular issues excluding tag in post relationship