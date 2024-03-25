// npm install -g nodemon

// npm install .
// nodemon ./index.js
// Access this server with http://localhost:5500

const {URI} = require('./_config.js');
const { TodoApp } = require('../util/utility.js');
const util = require('../util/mongodbutil.js');

const DATABASE = 'todoapp';
const POSTS = 'posts';
const COUNTER = 'counter';
const postapp = new TodoApp(URI, DATABASE, POSTS, COUNTER);

const login = async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    console.log(email, password);
    try {
        let existingUser = await User.findOne({ email: email });
        if(!existingUser) {
            throw new Error();
        }
        const compareResult = await bcrypt.compare(password, existingUser.password);
        console.log();
        if (!compareResult) {
            res.status(403).send({ message: 'password does not match'});
        } else {
            const payload = { id: existingUser._id, username: existingUser.email };
            const secretKey = process.env.SECERT_KEY;
            const token = jwt.sign(payload, secretKey, { expiresIn: '3h' });
            res.status(200).send({ token: token, expiresIn: '3h' })
        }
    } catch (error) {
        console.log(error);
        res.status(404).send({ message: 'User not found' });
    }

}