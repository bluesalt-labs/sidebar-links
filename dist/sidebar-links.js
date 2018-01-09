var sidebarLinks = function(baseUlID, headerLinkClass, maxDepth) {
    // Set Defaults
    this.baseUlID           = (typeof baseUlID !== 'undefined') ?  baseUlID : 'sidebar-links';
    this.headerLinkClass    = (typeof headerLinkClass !== 'undefined') ?  headerLinkClass : 'sidebar-link';
    this.maxDepth           = (typeof maxDepth === 'number' && maxDepth > 1 && maxDepth <= 6) ? maxDepth : 6;

    this.init = function() {
        var regex = new RegExp('[H|h][1-' + this.maxDepth + ']', 'g');
        var linksUl = document.getElementById(this.baseUlID);
        var headers = document.getElementsByClassName(this.headerLinkClass);

        // Create loop variables
        var prevLevel = 1;
        var prevUlID = linksUl.id;

        // Loop through all page header elements
        for(var i = 0; i < headers.length; i++) {
            // Create the new li element
            var newLi = this.createListItem(headers[i]);

            // Get the current indent/header level (and make sure it's a H1 - H{deepest} element)
            var curLevel = parseInt( headers[i].tagName.match(regex)[0].slice(-1) );

            // if this is first level header, just append to the base sidebar links ul
            if(curLevel === 1) {
                prevUlID = linksUl.id;
                linksUl.appendChild(newLi);
            }
            else if (curLevel > 1 && curLevel <= 7) { // If this is a subheader,
                // if we're at the same level as last time, we shouldn't have to create a new ul
                if(curLevel === prevLevel && prevUlID !== null) {
                    document.getElementById(prevUlID).appendChild(newLi)
                }
                // if we're at a lower level than last time, we also shouldn't have to create a new ul
                else if(curLevel < prevLevel && prevUlID !== null) {
                    while(prevLevel != curLevel && prevLevel > 1){
                        prevUlID = document.getElementById(prevUlID).parentElement.id;
                        prevLevel--;
                    }

                    document.getElementById(prevUlID).appendChild(newLi);
                }
                else if(curLevel > prevLevel) {
                    var newUlObj = this.createNewUlItem(newLi, i, curLevel, prevLevel);
                    document.getElementById(prevUlID).appendChild(newUlObj[1]);
                    prevUlID = newUlObj[0] !== null ? newUlObj[0] : prevUlID;
                } else {
                    console.log('Something broke, probably because previous UL was null. This shouldn\'t happen. prevUlID: ' + prevUlID);
                }
            } else { console.log('Something broke; link cannot be appended. This shouldn\'t happen. curLevel: ' + curLevel); }

            prevLevel = curLevel;
        }

    };

    /**
     * Returns a new list item element
     * @param headerItem
     * @returns {Element}
     */
    this.createListItem = function(headerItem) {
        var newLi = document.createElement('li');
        var link = document.createElement('a');

        link.innerHTML = headerItem.innerText;
        link.href = '#' + headerItem.id;

        newLi.appendChild(link);

        return newLi;
    };

    /**
     * Returns a nested Ul with the list item appended to the deepest ul item
     * @param listItem
     * @param curLevel
     * @param prevLevel
     * @returns {*}
     */
    this.createNewUlItem = function(listItem, listItemNum, curLevel, prevLevel) {
        if(curLevel > 0 && curLevel <= 7 && prevLevel > 0 && prevLevel <= 7 && prevLevel < curLevel) {
            var newUl = document.createElement('ul');
            var prevUlID = newUl.id = listItemNum + '-' + curLevel;
            newUl.appendChild(listItem);
            // If we're only nesting 1 level deep, just create a new Ul with the proper ID and return it
            // if we've gone deeper than 1 more than the previous level (which is dumb but totally possible)
            if( (prevLevel + 1) < curLevel ) {
                while(prevLevel != (curLevel - 1) && prevLevel < 6){
                    var tempUl = document.createElement('ul');
                    prevLevel++;
                    tempUl.id = 'n' + listItemNum + '-' + prevLevel;
                    tempUl.appendChild(newUl);
                    newUl = tempUl;
                }
            }

            return [prevUlID, newUl];
        } else {
            // If the depth is outside the range, return the list item, which will be appended
            return [null, listItem];
        }
    };

    this.init();
};