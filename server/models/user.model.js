import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name : {
    type: 'string',
    required: true,
  },
  email:{
    type: 'string',
    required:"true",
    unique: true,
    
  },
  password:{
    type: 'string',
    required: true,
    minlength: 6,
  },

},
{ timestamps: true }
)

export default mongoose.model("User",userSchema);