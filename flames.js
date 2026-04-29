        let raw1 = document.querySelectorAll("input")[0].value.trim();
        let raw2 = document.querySelectorAll("input")[1].value.trim();

        if (!raw1 || !raw2) {
            resultDiv.innerHTML = "Please enter both names";
            return;
        }

        let a = raw1.toLowerCase().replace(/ /g, "");
        let b = raw2.toLowerCase().replace(/ /g, "");

      
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