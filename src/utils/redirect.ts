import { Response } from "express";

export default function sendMessageWithRedirectionUrl(
  res: Response,
  message: string,
  redirectionUrl: string
) {
  res.render("message-with-link", {
    layout: "admin",
    message,
    link: redirectionUrl,
  });
}
