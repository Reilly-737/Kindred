#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime, timedelta
# Remote library imports
from faker import Faker

# Local imports
from config import app, db
from models import User, Tag, Artwork, ArtworkTag, PostTag, Comment, DiscussionPost

fake = Faker()


def clear_tables():
    db.drop_all()
    db.create_all()
    print("Tables dropped and created!")
   
def seed_users():
    for _ in range(10):
        new_user = User(
            username=fake.unique.user_name(),
            email=fake.email(),
            password="password",
            #bio=fake.bio()
        )
        db.session.add(new_user)
    db.session.commit()
    print("Users added!")
   
   
tags_list = [
    "Oil", "Acrylic", "Watercolor", "Pastel", "Charcoal", "Ink", "Pencil", "Pen", "Digital",
    "Collage", "Encaustic", "Gouache", "Tempera", "Fresco", "Linocut", "Lithography", "Etching",
    "Woodcut", "Silkscreen", "Batik", "Graffiti", "Mosaic", "Airbrush", "Spray Paint", "Ceramics",
    "Pottery", "Sculpture", "Wire", "Glassblowing", "Papier-Mâché", "Metalwork", "Calligraphy",
    "Printmaking", "Mixed Media", "Found Object", "Textile", "Mural", "Sand Art",
    "Digital Painting", "Quilling", "Polymer Clay"
]


def seed_tags():
    with app.app_context():
        Tag.query.delete()
        for tag_title in tags_list:
            new_tag = Tag(title=tag_title)
            db.session.add(new_tag)
        db.session.commit()
        print("Tags seeded!")

def seed_artwork():
    predefined_created_at = datetime.utcnow() - timedelta(days=5)  
    artwork_data = [
        {
            'title': 'The Odd Dream on A Distant Planet',
            'image_url': 'https://i.imgur.com/1crvAUE_d.jpg?maxwidth=520&shape=thumb&fidelity=high',
            'user_id': 1,
            'created_at': predefined_created_at,
        },
        {
            'title': 'Feeling A Growth Inside',
            'image_url': 'https://i.imgur.com/igP7cBA_d.jpg?maxwidth=520&shape=thumb&fidelity=high',
            'user_id': 2,
            'created_at': predefined_created_at,
        },
        {
            'title': 'The Pout',
            'image_url': 'https://i.imgur.com/b6P0PSw_d.jpg?maxwidth=520&shape=thumb&fidelity=high',
            'user_id': 3,
            'created_at': predefined_created_at,
        },
        # Add more artwork entries as needed
    ]
    for data in artwork_data:
        artwork = Artwork(**data)
        db.session.add(artwork)
    db.session.commit()
    print("Artworks seeded!")

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        clear_tables()
        seed_users()
        seed_tags()
        seed_artwork()
        print("Starting seed...")
        # Seed code goes here!