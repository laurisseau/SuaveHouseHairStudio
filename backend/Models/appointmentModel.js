import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        required: [true, 'A employee is required']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A user is required']
    },

    time:{
        type: String,
        required: [true, 'A time is required']
    },

    day:{
        type: String,
        required: [true, 'A Day is required']
    },

    dayName:{
        type: String,
        required: [true, 'A DayName is required']
    },

    month:{
        type: String,
        required: [true, 'A Month is required']
    },
    
    paymentMethod:{
        type: String,
        required: [true, 'A PaymentMethod is required']
    },

    cutName: {
        type:String,
        required: [true, 'A cut Name is required']
    },
    cutPrice:{
        type: String,
        required: [true, 'A cut Price is required']
    },

    clientSecret:{
        type: String,
    },

    paid:{
        type: String,
        default: "Not Paid"
    },

    active:{
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

},

{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}

)

const Appointments = mongoose.model('Appointments', appointmentSchema);

export default Appointments;