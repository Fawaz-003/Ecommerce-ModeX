const adminDashboard = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Welcome to Admin Dashboard",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

export { adminDashboard };