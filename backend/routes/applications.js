const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// GET /api/applications - Retrieve all applications
router.get('/', async (req, res) => {
    try {
        const applications = await Application.find()
            .sort({ created_at: -1 }); // Most recent first
        
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            message: 'Error fetching applications',
            error: error.message
        });
    }
});

// GET /api/applications/:id - Get single application
router.get('/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        res.status(200).json(application);
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({
            message: 'Error fetching application',
            error: error.message
        });
    }
});

// POST /api/applications - Create new application
router.post('/', async (req, res) => {
    try {
        const { company, role, date_applied, status, notes } = req.body;
        
        // Validation
        if (!company || !role || !date_applied || !status) {
            return res.status(400).json({
                message: 'Missing required fields: company, role, date_applied, and status are required'
            });
        }
        
        const newApplication = new Application({
            company,
            role,
            date_applied,
            status,
            notes: notes || ''
        });
        
        const savedApplication = await newApplication.save();
        
        res.status(201).json({
            message: 'Application created successfully',
            application: savedApplication
        });
    } catch (error) {
        console.error('Error creating application:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        
        res.status(500).json({
            message: 'Error creating application',
            error: error.message
        });
    }
});

// PUT /api/applications/:id - Update application
router.put('/:id', async (req, res) => {
    try {
        const { company, role, date_applied, status, notes } = req.body;
        
        // Validation
        if (!company || !role || !date_applied || !status) {
            return res.status(400).json({
                message: 'Missing required fields: company, role, date_applied, and status are required'
            });
        }
        
        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            {
                company,
                role,
                date_applied,
                status,
                notes: notes || '',
                updated_at: Date.now()
            },
            { 
                new: true,           // Return updated document
                runValidators: true  // Run schema validation
            }
        );
        
        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        res.status(200).json({
            message: 'Application updated successfully',
            application: updatedApplication
        });
    } catch (error) {
        console.error('Error updating application:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        
        res.status(500).json({
            message: 'Error updating application',
            error: error.message
        });
    }
});

// DELETE /api/applications/:id - Delete application
router.delete('/:id', async (req, res) => {
    try {
        const deletedApplication = await Application.findByIdAndDelete(req.params.id);
        
        if (!deletedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        res.status(200).json({ 
            message: 'Application deleted successfully',
            application: deletedApplication
        });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({
            message: 'Error deleting application',
            error: error.message
        });
    }
});

module.exports = router;
