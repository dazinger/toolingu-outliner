{   
    function popupScript(pu, url) {
        pu.document.open(url);
        pu.location.href = url;

        return new Promise(resolve => setTimeout(resolve, 8000)) .then(() => {
            if (pu.document.readyState === 'complete') {
                var row = pu.document.getElementById('body_ContentPlaceHolder1_pnlOutlineObjectives');
                
                var allCardElements = Array.from(pu.document.documentElement.getElementsByClassName('card'));
                allCardElements = allCardElements.splice(2);
                var filteredCardElements = allCardElements.filter(element => {
                    const text = element.textContent;
                    var vocab_table = text.includes("Class Vocabulary");
                    return vocab_table;
                });

                var card = filteredCardElements.map(element => element.outerHTML);
            
                return [row.outerHTML, card];
            }
        });
    }
    
    var popupWindow = window.open('');
    // n is based on 50 items per page, and m is the number of pages.  Adjust manually as needed.
    var n = 50, m = 1, i = 0, j = 0;
    var everyPage = [];
    var nextPageButtonClass = "#ctl00_ctl00_body_ContentPlaceHolder1_ctl00_RadGrid1_ctl00 > tfoot > tr > td > div > div.rgWrap.rgArrPart2 > button.t-button.rgActionButton.rgPageNext";
    
    while (i < m) {
        while (j < n) { 
            var input = "#ctl00_ctl00_body_ContentPlaceHolder1_ctl00_RadGrid1_ctl00__" + j.toString() + " > td:nth-child(3) > a";
            var col_3_body = document.querySelector(input);
            var text = col_3_body.text;
            var url = col_3_body.href;
            var newPage = await popupScript(popupWindow, url);
            everyPage.push(`<p style = "font-size: 200%"><b>` + text + `</b></p>`);
            everyPage.push(`<div style = "display: flex; flex-wrap: wrap; font-size: 110%;"` + newPage[0] + `</div>`);
            everyPage.push(`<div style = "font-size: 150%;"${newPage[1].join('')}</div>`);
            j += 1;
        }
        i += 1;
        j = 0;
        if (i == 1) {
            n = 28;
            var nextPageButton = document.querySelector(nextPageButtonClass);
            var clickEvent = new MouseEvent('click', {bubbles: true, cancelable: true, view: window});
            nextPageButton.dispatchEvent(clickEvent);
            await new Promise((delay) => setTimeout(delay, 1500));
        }
    }

    popupWindow.document.write(everyPage.join(''));
}
