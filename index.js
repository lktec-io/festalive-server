const express = require("express");
const cors = require("cors");
const User = require("./model/users");
const Creator = require("./model/creator");
const Organizer = require("./model/organizer");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// -------------------- CLOUDINARY CONFIG --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------- MULTER STORAGE --------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -------------------- HELPER FUNCTION: UPLOAD TO CLOUDINARY --------------------
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// -------------------- HELPER FUNCTION: LOGIN --------------------
const loginHelper = async (Model, email, password, role, res) => {
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const user = await Model.findOne({ where: { email } });
  if (!user) return res.status(400).json({ message: `${role} not found` });

  const validPassword = await bcrypt.compare(password.trim(), user.password);
  if (!validPassword) return res.status(400).json({ message: "Incorrect password" });

  const { password: _, ...userData } = user.toJSON();
  return res.json({ message: "Login successful", user: { ...userData, role } });
};

// -------------------- USER REGISTER & LOGIN --------------------
app.post("/api/user/register", upload.single("profilePic"), async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {
    if (!email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password does not match" });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    let profilePicUrl = null;
    if (req.file) {
      profilePicUrl = await uploadToCloudinary(req.file.buffer, "users");
    }

    const newUser = await User.create({
      email,
      password: hashedPassword,
      profilePic: profilePicUrl,
      role: "user",
    });

    const { password: _, ...userData } = newUser.toJSON();
    res.json({ message: "Registration successful", user: userData });
  } catch (err) {
    console.error("User register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await loginHelper(User, email, password, "user", res);
  } catch (err) {
    console.error("User login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- CREATOR REGISTER & LOGIN --------------------
app.post("/api/creator/register", upload.single("profilePic"), async (req, res) => {
  try {
    const formData = req.body;
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password does not match" });

    const existing = await Creator.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    let profilePicUrl = null;
    if (req.file) {
      profilePicUrl = await uploadToCloudinary(req.file.buffer, "creators");
    }

    const newCreator = await Creator.create({
      email,
      password: hashedPassword,
      fullName: formData.fullName,
      stageName: formData.stageName,
      bio: formData.bio,
      socials: formData.socials ? JSON.parse(formData.socials) : [],
      categories: formData.categories ? JSON.parse(formData.categories) : [],
      location: formData.location,
      phone: formData.phone,
      website: formData.website || "",
      profilePic: profilePicUrl,
      role: "creator",
    });

    const { password: _, ...userData } = newCreator.toJSON();
    res.json({ message: "Registration successful", user: userData });
  } catch (err) {
    console.error("Creator register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/creator/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await loginHelper(Creator, email, password, "creator", res);
  } catch (err) {
    console.error("Creator login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- ORGANIZER REGISTER & LOGIN --------------------
app.post("/api/organizer/register", upload.single("profilePic"), async (req, res) => {
  try {
    const formData = req.body;
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password does not match" });

    const existing = await Organizer.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    let profilePicUrl = null;
    if (req.file) {
      profilePicUrl = await uploadToCloudinary(req.file.buffer, "organizers");
    }

    const newOrganizer = await Organizer.create({
      email,
      password: hashedPassword,
      organizationName: formData.organizationName,
      organizerType: formData.organizerType,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      businessLocation: formData.businessLocation,
      website: formData.website || "",
      taxId: formData.taxId || "",
      description: formData.description || "",
      socialMedia: formData.socialMedia || "",
      profilePic: profilePicUrl,
      role: "organizer",
    });

    const { password: _, ...userData } = newOrganizer.toJSON();
    res.json({ message: "Registration successful", user: userData });
  } catch (err) {
    console.error("Organizer register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/organizer/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await loginHelper(Organizer, email, password, "organizer", res);
  } catch (err) {
    console.error("Organizer login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- START SERVER -----------------
app.listen(port, () => {
  console.log("Server running on port", port);
});




// app.delete("/api/post/:id",async(req,res)=>{
//   const {id} = req.params ;
//   await Ticket.destroy({
//     where:{
//       id: id
//     }
//   })
// })
// app.get("/api/ticket/:id",async(req,res)=>{
//   console.log("here: ", req.params.id)
//   const ticket_id = req.params.id;
//   const onedata = await Ticket.findAll(
//     {
//       where: {
//         id: ticket_id
//       }
//     }
//   )
//   return res.json(onedata)
// })

// app.get("/api/ticket/user/:teacher",async(req,res)=>{
//      const {teacher} = req.params;

//      const onedata = await Ticket.findAll({
//       where: {
//         role: teacher
//       }
//      })
//   return res.json(onedata)
// })

// app.listen(port, () => {
//   console.log("server is active at port", port);
// });
