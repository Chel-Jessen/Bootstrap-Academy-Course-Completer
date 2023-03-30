function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function mark_as_complete(length) {
    let break_flag = false;
    console.log("started")
    for (let i = 0; i < length; i++) {
        if (!window.location.pathname.endsWith("watch")) {
            // Enter course section
            document.querySelector("#__nuxt > div > main > section.card.style-card.bg-secondary.md\\:sticky.md\\:top-container.md\\:self-start > button").click();
            console.log("entered");
        }

        // Wait for site to load and then mark as completed
        await wait(1000);
        console.log("loaded");
        if (document.querySelector("#__nuxt > div > div.relative > main > header > div > div")) {
            console.log("skipped");
            // Next section
            if (await next_section()) {
                break_flag = true;
                break;
            }
        }
        // Mark as completed
        await wait(1000);
        console.log("marked");
        document.querySelector("#__nuxt > div > div.relative > main > header > div > button").click();
        // Next section
        if (await next_section()) {
            break_flag = true;
            break;
        }
    }
    if (break_flag) {
        console.log("completed");
    }
}

function next_section() {
    console.log("next");
    return new Promise((resolve) => {
        // Click next section
        setTimeout(() => {
            document.querySelector("#__nuxt > div > div.relative > main > header > article.hidden.midXl\\:flex.gap-box.items-center.h-fit.w-fit > button.sm.flex-row-reverse.primary.bg-accent.text-primary.hover\\:bg-accent.border.border-accent.hover\\:ring-4.md\\:hover\\:ring-8.hover\\:ring-tertiary").click();
            resolve();
            }, 1000);
    }).then(() => {
        // Check if course is completed
        const completed_h6 = document.querySelector("#__nuxt > div > section.pb-container.fixed.z-50.left-0.top-0.w-screen.h-screen.overflow-hidden.bg-\\[\\#0b192edd\\] > div > article > div.card.grid.gap-x-4.md\\:gap-x-6.grid-cols-\\[auto_1fr\\] > h6");
        if (completed_h6) {
            const style = getComputedStyle(completed_h6);
            if (style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                return true;
            }
        }
        return false;
    });
}

function create_button(parent) {
    const button = document.createElement('button');
    button.setAttribute('id', 'activate-mark-as-complete-button');
    button.innerText = 'Mark as Complete';

    //Apply styles
    button.style.borderWidth = "1px";
    // Apply different width depending on the site
    if (window.location.pathname.endsWith("watch")){
        button.style.width = "150px";
    }
    else {
        button.style.width = "100%";
    }
    button.style.borderColor = '#0cc9ab';
    button.style.color = '#0b192e';
    button.style.marginTop = '1rem';
    button.style.alignItems = 'center';
    button.style.borderRadius = '.25rem';
    button.style.fontFamily = 'Arial,Helvetica,sans-serif';
    button.style.letterSpacing = '.1em';
    button.style.textAlign = 'center';
    button.style.textTransform = 'uppercase';
    button.style.backgroundColor = '#0cc9ab';
    button.style.boxShadow = '0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000';
    button.style.gap = '.75rem';
    button.style.padding = '.75rem 1.25rem';
    button.style.fontSize = '1rem';
    button.style.lineHeight = '1rem';

    // Add eventlistener to start extension
    button.addEventListener('click', async function () {
        let sections = 0;
        if (window.location.pathname.endsWith("watch")){
            let articles = document.querySelector("#__nuxt > div > div.relative > main > div > section > article").querySelectorAll("article");
            sections = articles.length;
        }
        else{
            sections = parseInt(document.querySelector("#__nuxt > div > main > section.card.style-card.bg-secondary.md\\:sticky.md\\:top-container.md\\:self-start > div > article:nth-child(3) > div").innerText.split(" ")[0]);
        }
        await mark_as_complete(sections);
    });

    parent.appendChild(button);
}


function inject(){
    // Check if it's the course home page
    if (window.location.pathname.endsWith("watch")) {
        // Append the button to start extension
        let parent_node = document.querySelector("#__nuxt > div > div.relative > main > header > div")
        create_button(parent_node);
    } else {
        // Append the button to start extension
        let parent_node = document.querySelector("#__nuxt > div > main > section.card.style-card.bg-secondary.md\\:sticky.md\\:top-container.md\\:self-start");
        create_button(parent_node);
    }
}

// Start extension after DOM is loaded
setTimeout(() => {
    inject();
    }, 2000)