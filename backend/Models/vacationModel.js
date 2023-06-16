import mongoose from 'mongoose';

const vacationSchema = new mongoose.Schema({

    startDate:{
        type: String,
        required: [true, 'an start date is required']
    },

    endDate: {
        type: String,
        required: [true, 'an end date is required']
    },

    employee: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        //required: [true, 'A employee is required']
    },
    day:{
        type: String,
        //required: [true, 'A Day is required']
    },

    month:{
        type: String,
        //required: [true, 'A Month is required']
    }

},

{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}

)

const Vacations = mongoose.model('Vacations', vacationSchema);

export default Vacations;