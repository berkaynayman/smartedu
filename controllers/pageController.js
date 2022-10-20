const nodemailer = require("nodemailer");
const Course = require('../model/Course');
const User = require('../model/User');

exports.getIndexPage = async (req, res) => {

    const courses = await Course.find().sort('-createdAt').limit(2)
    const totalCourses = await Course.find().countDocuments()
    const totalStudents = await User.countDocuments({role: 'student'})
    const totalTeachers = await User.countDocuments({role: 'teacher'})

    res.status(200).render('index', {
        page_name: "index",
        courses,
        totalCourses,
        totalStudents,
        totalTeachers
    })
}

exports.getAboutPage = (req, res) => {
    res.status(200).render('about', {
        page_name: "about"
    })
}

exports.getRegisterPage = (req, res) => {
    res.status(200).render('register', {
        page_name: "register"
    })
}

exports.getLoginPage = (req, res) => {
    res.status(200).render('login', {
        page_name: "login"
    })
}

exports.getContactPage = (req, res) => {
    res.status(200).render('contact', {
        page_name: "contact"
    })
}

exports.sendEmail = async (req, res) => {
    
    try {
        const outputMessage = `    
            <h1>Mail Details</h1>
            <ul>
                <li>Name: ${req.body.name}</li>
                <li>Email: ${req.body.email}</li>
            </ul>
            <h1>Message</h1>
            <p>${req.body.message}</p>
        `

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
            user: "************@gmail.com", // gmail account
            pass: "*************", // gmail pass for this smart edu app
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Smart edu contact form 👻" <***************>', // sender address
            to: "*****************", // list of receivers
            subject: "SMART EDU CONTACT FORM NEW MESSAGE ✔", // Subject line
            text: "Hello world?", // plain text body
            html: outputMessage, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...  

        req.flash("success", "We Received your message succesfully")
    } catch (error) {
        req.flash("error", `Something happened! ${error}`)
    } finally {
        res.status(200).redirect('contact')
    }

}