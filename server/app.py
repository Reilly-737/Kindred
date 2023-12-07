#!/usr/bin/env python3

# Local imports
from config import app
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


if __name__ == '__main__':
    app.run(port=5555, debug=True)