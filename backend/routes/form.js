// Update an application (for the logged-in user)
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedForm = await Form.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // Ensure the user is the owner
      { ...req.body },
      { new: true }
    );

    if (!updatedForm) return res.status(404).json({ message: 'Form not found or unauthorized' });

    res.json(updatedForm);
  } catch (err) {
    res.status(500).json({ message: 'Error updating form' });
  }
});
