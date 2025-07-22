const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true
    },
    date_applied: {
        type: Date,
        required: [true, 'Application date is required']
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: {
            values: ['Applied', 'Interview', 'Offer', 'Rejected'],
            message: '{VALUE} is not a valid status'
        }
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Update the updated_at field before saving
applicationSchema.pre('save', function(next) {
    if (this.isModified() && !this.isNew) {
        this.updated_at = Date.now();
    }
    next();
});

module.exports = mongoose.model('Application', applicationSchema);