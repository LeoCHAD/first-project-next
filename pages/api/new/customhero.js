"use strict"
import { connectDB } from "../../../lib/dbConnect";
import User from "../../../models/user";
import { decode } from "jsonwebtoken";

export default async function newFavoriteHandle(req, res) {
  try {
    const { tokenUser } = req.cookies;
    const newCustom = JSON.parse(req.body)
    const tokenDecode = decode(tokenUser, { complete: true });
    const userT = tokenDecode.payload.user;
    await connectDB();
    const userR = await User.findOne({ username: `${userT}` }).exec();
    //validación de contraseña
    console.log("usuario encontrado");
    let herosC = userR.custom_heros;
    //control de limite de heroes creados (12)
    if(herosC.length >= 12) return res.status(500).json({ success: false, limitControl: true });
    herosC.push(newCustom);
    console.log("custom añadido");
    const userUp = await User.findOneAndUpdate(
      { username: `${userT}` },
      { custom_heros: herosC }
    );
    console.log("update done");
    res.status(200).json({ success: true, limitControl: false });
  } catch (error) {
    console.log("**", error);
    res.status(400).json({ success: false, limitControl: false });
  }
}
