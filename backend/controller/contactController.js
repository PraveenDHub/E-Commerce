import { Contact } from "../model/contactModel.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email and message are required" });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message received successfully!",
      data: contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while sending message" });
  }
};
