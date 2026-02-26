import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

    async create(authorId: string, createPostDto: CreatePostDto): Promise<Post> {
        const createdPost = new this.postModel({
            ...createPostDto,
            author: new Types.ObjectId(authorId),
        });
        return createdPost.save();
    }

    async findAll(isPublishedOnly = true): Promise<Post[]> {
        const filter = isPublishedOnly ? { isPublished: true } : {};
        return this.postModel.find(filter).populate('author', 'name email').sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Post> {
        const post = await this.postModel.findById(id).populate('author', 'name email').exec();
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
        const updatedPost = await this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
        if (!updatedPost) {
            throw new NotFoundException('Post not found');
        }
        return updatedPost;
    }

    async remove(id: string): Promise<Post> {
        const deletedPost = await this.postModel.findByIdAndDelete(id).exec();
        if (!deletedPost) {
            throw new NotFoundException('Post not found');
        }
        return deletedPost;
    }
}
