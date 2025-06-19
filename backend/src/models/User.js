import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        bio: {
            type: String,
            default: ""
        },
        profilePic: {
            type: String,
            default: ""
        },
        nativeLanguage: {
            type: String,
            default: ""
        },
        learningLanguage: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: "",
        },
        isOnboarded: { // this will be true when complete their profile info (Bio, nativeLanguage, etc...) // NO chat until this be true
            type: Boolean,
            default: false
        },
        friends: [ // array of id 'User object'
            {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            }
        ]
    },
    { timestamps: true }
)

// pre hook // hashing password
// before save User to DB will hash the password

userSchema.pre("save", async function(next) {

    // Only re-hash the password if the user actually changes it // so not call this function again for updata (bio, etc..)
    if(!this.isModified("password")) return next() // will not hash
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt)

        next();
    } catch (error) {
        next(error)
    }
})


// check if password correct
userSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password)
    return isPasswordCorrect
}
const User = mongoose.model("User", userSchema)
export default User