document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const resultDiv = document.createElement("div");
    resultDiv.id = "result";
    resultDiv.style.cssText = `
        margin-top: 20px; padding: 25px; border-radius: 15px; text-align: center;
        background: rgba(0,0,0,0.5); color: white; font-family: 'Poppins', sans-serif;
        backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.2);
    `;
    form.after(resultDiv);

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        let raw1 = document.querySelectorAll("input")[0].value.trim();
        let raw2 = document.querySelectorAll("input")[1].value.trim();

        if (!raw1 || !raw2) {
            resultDiv.innerHTML = "Please enter both names";
            return;
        }

        let a = raw1.toLowerCase().replace(/ /g, "");
        let b = raw2.toLowerCase().replace(/ /g, "");

        // === YOUR ORIGINAL FLAMES LOGIC (unchanged) ===
        let s1 = a.split("");
        let s2 = b.split("");

        if (s1.length > s2.length) {
            let i = 0;
            while (i < s1.length) {
                let ch = s1[i];
                if (s2.includes(ch)) {
                    s1.splice(i, 1);
                    s2.splice(s2.indexOf(ch), 1);
                    i = 0;
                } else i++;
            }
        } else {
            let i = 0;
            while (i < s2.length) {
                let ch = s2[i];
                if (s1.includes(ch)) {
                    s2.splice(i, 1);
                    s1.splice(s1.indexOf(ch), 1);
                    i = 0;
                } else i++;
            }
        }

        let count = s1.length + s2.length;

        let flames = ["F", "L", "A", "M", "E", "S"];
        while (flames.length > 1) {
            let index = (count - 1) % flames.length;
            flames.splice(index, 1);
            flames = flames.slice(index).concat(flames.slice(0, index));
        }

        let result = flames[0];

        let base = (count * 7) % 101;
        let percentage;
        if (["L", "M"].includes(result)) {
            percentage = Math.max(base, Math.floor(Math.random() * 31) + 70);
        } else if (["A", "F"].includes(result)) {
            percentage = Math.max(base, Math.floor(Math.random() * 41) + 40);
        } else {
            percentage = Math.min(base, Math.floor(Math.random() * 50) + 1);
        }

        const meanings = {
            "F": "Friends", "L": "Lovers", "A": "Affection",
            "M": "Marriage", "E": "Enemy", "S": "Siblings"
        };

        // === SEND TO PHP + CHECK FOR MATCH ===
        try {
            const response = await fetch("save.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `name1=${encodeURIComponent(raw1)}&name2=${encodeURIComponent(raw2)}&result=${result}&percentage=${percentage}`
            });

            const data = await response.json();

            if (data.match) {
                // IT'S A CHRISTMAS MATCH!!!
                const dateIdeas = [
                    "Midnight filter coffee under fairy lights",
                    "Secret Santa gift exchange at a cafe",
                    "Christmas movie marathon with cuddles",
                    "Walk through decorated streets holding hands",
                    "Ice-skating + hot chocolate date"
                ];
                const idea = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];

                resultDiv.innerHTML = `
                    <div style="font-size:3.8rem;animation:pulse 2s infinite;">IT'S A MATCH!</div>
                    <div style="font-size:2.5rem;margin:15px 0;">${raw1.split(" ")[0]} + ${raw2.split(" ")[0]}</div>
                    <div style="font-size:4.5rem;color:#ff1744;margin:10px 0;">${percentage}% ${meanings[result]}</div>
                    <div style="background:#FFD700;color:#d32f2f;padding:20px;border-radius:15px;margin:20px 0;font-size:1.4rem;">
                        They searched you <b>${data.minutes_ago} minutes ago</b>!<br><br>
                        Secret Christmas Date Idea:<br><b>${idea}</b>
                    </div>
                    <div style="font-size:1.3rem;margin-top:15px;">
                        Share this link — they’ll see the magic too
                    </div>
                `;

                // Fireworks background
                document.body.style.background = "linear-gradient(45deg, #ff9a9e, #fad0c4, #fad0c4, #a18cd1)";
                document.body.style.backgroundSize = "400% 400%";
                document.body.style.animation = "gradient 8s ease infinite";
            } else {
                // Normal result
                resultDiv.innerHTML = `
                    <div style="font-size:2.8rem;margin-bottom:10px;">${meanings[result]}</div>
                    <div style="font-size:4.5rem;color:#e91e63;">${percentage}%</div>
                    <div style="margin-top:15px;font-size:1.3rem;">
                        Send this link to <b>${raw2.split(" ")[0]}</b> and pray they search you back before Christmas!
                    </div>
                `;
            }
        } catch (err) {
            resultDiv.innerHTML = `<div style="color:#ff5252;">Network error — try again!</div>`;
        }
    });
});