const express = require("express");
const cors = require("cors");
const User = require("./model/users");
const { where } = require("sequelize");
const bcrypt = require("bcrypt");

const app = express();
const port = 8000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);


app.post("/api/user/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  console.log(req.body)
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email registered" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password not match" });
    }

    const newUser = await User.create({ email, password });
    res.json({ message: "Usajili umefanikiwa", user: newUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email not found in the database" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: " incorrect Password" });
    }
    console.log("successufly login: ",user)
   return res.status(200).json({ message: "Login successful", user });

   res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



app.delete("/api/post/:id",async(req,res)=>{
  const {id} = req.params ;
  await Ticket.destroy({
    where:{
      id: id
    }
  })
})
app.get("/api/ticket/:id",async(req,res)=>{
  console.log("here: ", req.params.id)
  const ticket_id = req.params.id;
  const onedata = await Ticket.findAll(
    {
      where: {
        id: ticket_id
      }
    }
  )
  return res.json(onedata)
})

app.get("/api/ticket/user/:teacher",async(req,res)=>{
     const {teacher} = req.params;
     
     const onedata = await Ticket.findAll({
      where: {
        role: teacher
      }
     })
  return res.json(onedata)
})

app.listen(port, () => {
  console.log("server is active at port", port);
});
