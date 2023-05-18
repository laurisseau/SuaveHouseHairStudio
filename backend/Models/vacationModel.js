import mongoose from 'mongoose';

const vacationSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        required: [true, 'A employee is required']
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
    }

},

{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}

)

const Vacations = mongoose.model('Vacations', vacationSchema);

export default Vacations;