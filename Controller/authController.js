require("dotenv").config()
const userModel = require("../Models/user-model");
const ownerModel = require("../Models/owner-model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../Models/user-model"); 
const transporter = require("../config/mailer");


/* ================= REGISTER ================= */
const blockedEmail = process.env.BLOCKED_EMAIL;

module.exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Required fields
    if (!fullname || !email || !password) {
      return res.render("register", {
        toastMsg: "All fields are required",
        toastType: "error"
      });
    }

    // Block email
    if (blockedEmail && email.toLowerCase() === blockedEmail.toLowerCase()) {
      return res.render("register", {
        toastMsg: "This email is not allowed to register",
        toastType: "error"
      });
    }

    // Check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.render("register", {
        toastMsg: "Email already registered. Please login.",
        toastType: "error"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (NO EMAIL SYSTEM)
    await userModel.create({
      fullname,
      email,
      password: hashedPassword
    });

    return res.render("login", {
      toastMsg: "Account created successfully. Please login.",
      toastType: "success"
    });

  } catch (err) {
    console.error(err);
    return res.render("register", {
      toastMsg: "Something went wrong. Please try again.",
      toastType: "error"
    });
  }
};

/* ================= VERIFY EMAIL ================= */

// module.exports.verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;

//     const user = await userModel.findOne({ verificationToken: token });

//     if (!user) {
//       return res.render("login", {
//         toastMsg: "Invalid verification link",
//         toastType: "error"
//       });
//     }

//     if (user.verificationTokenExpiry < Date.now()) {
//       return res.render("login", {
//         toastMsg: "Link expired. Please resend verification email.",
//         toastType: "error",
//         showReverify: true,
//         email: user.email
//       });
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpiry = undefined;
//     await user.save();

//     return res.render("login", {
//       toastMsg: "Email verified successfully",
//       toastType: "success"
//     });

//   } catch (err) {
//     console.error(err);
//     return res.render("login", {
//       toastMsg: "Something went wrong",
//       toastType: "error"
//     });
//   }
// };

/* ================= LOGIN ================= */

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Owner login
    const owner = await ownerModel.findOne({ email });
    if (owner) {
      const match = await bcrypt.compare(password, owner.password);
      if (!match) {
        return res.render("login", {
          toastMsg: "Incorrect password",
          toastType: "error"
        });
      }

      req.session.owner = { id: owner._id.toString(), fullname: owner.fullname };
      return res.redirect("/");
    }

    // User login
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.render("login", {
        toastMsg: "User not found",
        toastType: "error"
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("login", {
        toastMsg: "Incorrect password",
        toastType: "error"
      });
    }

    req.session.user = { id: user._id.toString(), fullname: user.fullname };
    return res.redirect("/");

  } catch (err) {
    console.error(err);
    return res.render("login", {
      toastMsg: "Something went wrong",
      toastType: "error"
    });
  }
};



/* ================= RESEND VERIFICATION ================= */

// module.exports.resendVerification = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await userModel.findOne({ email });

//     if (!user) {
//       return res.render("login", {
//         toastMsg: "User not found",
//         toastType: "error"
//       });
//     }

//     if (user.isVerified) {
//       return res.render("login", {
//         toastMsg: "Email already verified",
//         toastType: "success"
//       });
//     }

//     const token = crypto.randomBytes(32).toString("hex");

//     user.verificationToken = token;
//     user.verificationTokenExpiry = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     const verifyLink = `http://localhost:3000/users/verify-email/${token}`;

//    await transporter.sendMail({
//   from: `"My Store" <${process.env.EMAIL}>`,
//   to: user.email,
//   subject: "Verify Your Email – Reminder | My Store",
//   html: `
//   <div style="background:#f3f4f6;padding:40px 0;font-family:Segoe UI,Arial,sans-serif;">
//     <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;
//                 box-shadow:0 10px 30px rgba(0,0,0,0.1);overflow:hidden;">

//       <!-- HEADER -->
//       <div style="background:linear-gradient(135deg,#f59e0b,#ef4444);
//                   padding:30px;text-align:center;color:#ffffff;">
//         <h1 style="margin:0;font-size:26px;">My Store</h1>
//         <p style="margin-top:6px;font-size:14px;opacity:0.9;">
//           Verification Reminder
//         </p>
//       </div>

//       <!-- BODY -->
//       <div style="padding:35px;color:#374151;">
//         <h2 style="margin-top:0;color:#111827;">Verify Your Email Address</h2>

//         <p style="font-size:15px;line-height:1.6;">
//           You recently requested a new email verification link.  
//           Please confirm your email address to activate your account.
//         </p>

//         <!-- BUTTON -->
//         <div style="text-align:center;margin:35px 0;">
//           <a href="${verifyLink}"
//              style="background:linear-gradient(135deg,#f97316,#ef4444);
//                     color:#ffffff;
//                     padding:14px 34px;
//                     text-decoration:none;
//                     font-size:15px;
//                     font-weight:600;
//                     border-radius:30px;
//                     display:inline-block;
//                     box-shadow:0 6px 18px rgba(239,68,68,0.35);">
//             🔐 Verify Email
//           </a>
//         </div>

//         <p style="font-size:14px;color:#6b7280;">
//           ⏰ This verification link will expire in <strong>10 minutes</strong>.
//         </p>

//         <p style="font-size:14px;color:#6b7280;">
//           If you did not request this email, please ignore it.
//         </p>
//       </div>

//       <!-- FOOTER -->
//       <div style="background:#f9fafb;text-align:center;padding:18px;
//                   font-size:12px;color:#9ca3af;">
//         © ${new Date().getFullYear()} My Store • All rights reserved
//       </div>

//     </div>
//   </div>
//   `
// });


//     return res.render("login", {
//       toastMsg: "Verification email resent successfully",
//       toastType: "success"
//     });

//   } catch (err) {
//     console.error(err);
//     return res.render("login", {
//       toastMsg: "Failed to send email",
//       toastType: "error"
//     });
//   }
// };



// ----------------  PROFILE ---------------
module.exports.userProfile = async (req, res) => {
  try {
    const userId = req.session.user?.id; // user ke liye
    
    if (!userId) return res.redirect("/login");

    const user = await User.findById(userId);
    res.render("profile", { user });
  } catch (err) {
    console.error(err);
    res.send("Something went wrong");
  }
};

// ---------------- UPDATE PROFILE --------
module.exports.userUpdateProfile  = async (req, res) => {
  try {
    const { name, contact, address } = req.body;
    const userId = req.session.user?.id; // owner ke liye owner?.id

    if (!userId) {
      return res.redirect("/login");
    }

    await User.findByIdAndUpdate(userId, {
      fullname: name, // db me fullname field hai
      contact,
      address
    });

    // Update session fullname too
    req.session.user.fullname = name;

    res.render("index");
  } catch (err) {
    console.error(err);
    res.send("Something went wrong");
  }
};

module.exports.userMyOrder =  async (req, res) => {

  const userId = req.session.user?.id;
  if (!userId) {
    return res.redirect("/login");
  }

  const user = await User.findById(userId)
.populate({
  path: "orders",
  options: { sort: { orderDate: -1 } },
  populate: {
    path: "items.product"
  }
});

  res.render("my-orders", { orders: user.orders });
}