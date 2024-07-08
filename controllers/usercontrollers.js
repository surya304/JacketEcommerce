const User = require('../models/user');
const bcrypt = require('bcrypt');



exports.login = async (req, res) => {
    console.log(req.body, "req.body login");
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            res.status(401).send('Invalid email or password');
            return;
        }
        req.session.userId = user._id; // Save user ID or other relevant info in the session

        // send  success response
        res.redirect('/');
       
    } catch (error) {
        res.status(500).send('An error occurred');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send('An error occurred');
            return;
        }
        res.redirect('/login');
    });
}

exports.signup = async (req, res) => {

    console.log(req.body , "req.body");
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.log(error,"signup error");
        res.status(500).send('An error occurred');
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.redirect('/resetpassword');
    } catch (error) {
        res.status(500).send('An error occurred');
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req
            .body.email });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        await user.save();
        res.redirect('/login');
    }
    catch (error) {
        res.status(500).send('An error occurred');
    }

}
