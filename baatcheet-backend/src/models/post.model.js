import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const postSchema = mongoose.Schema(
    {
        image:{
            type:String,
            required:true
        },
        caption:{
            type:String,
            required:true
        },
        likesCount:{
            type:Number,
            default:0
        },
        commentCount:{
            type:Number,
            default:0
        },
        shareCount:{
            type:Number,
            default:0
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
        
    }, {timestamps: true})


postSchema.plugin(mongooseAggregatePaginate)
export const Post = mongoose.model("Post", postSchema)