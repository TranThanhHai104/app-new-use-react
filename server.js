import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/tts", async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    try {
        const { data } = await axios.post("https://api.fpt.ai/hmi/tts/v5", text, {
            headers: {
                "api-key": "Jgk2fCzrACvspSniZn9o3ijWC209h3ho",
                "voice": "banmai",
                "Content-Type": "text/plain"
            }
        });

        if (data?.async) return res.json({ url: data.async });
        res.status(500).json({ error: "FPT failed" });
    } catch (err) {
        console.error("TTS Error:", err.message);
        res.status(500).json({ error: "Server busy" });
    }
});

app.get("/api/crawl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send("URL is required");

    try {
        const { data: html } = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" },
            timeout: 5000
        });

        const dom = new JSDOM(html, { url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        let content = article?.content;
        if (!content) {
            const $ = cheerio.load(html);
            content = $(".maincontent, .content-detail, .article-content").html();
        }

        const $ = cheerio.load(content || "");
        $("script, style, iframe, .vnn-content-related, .insert-video, .box-google-ads").remove();

        res.json({ success: true, content: $.html() });
    } catch (err) {
        console.error("Crawl Error:", err.message);
        res.json({ success: false, error: "Link die or blocked" });
    }
});

app.listen(3000, () => console.log("> API Server ready on port 3000"));