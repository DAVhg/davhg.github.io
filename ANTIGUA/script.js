// values to keep track of the number of letters typed, which quote to use. etc. Don't change these values.
var i = 0,
    a = 0,
    isBackspacing = false,
    isParagraph = false;

// Typerwrite text content. Use a pipe to indicate the start of the second line "|".  
var textArray = [
    "",
    //"A problem has been detected and Windows has been shut down to prevent damage to your computer. | If this is the first time you've seen this stop error screen, restart your computer. if this screen appears again, follow these steps: | Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for and Windows updates you might need. | If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing. If you need to use Safe Mode to remove or disable components, restart your computer, press F8 to select Advanced Startup Options, and then select Safe Mode. | Technical information: | *** STOP: 0x000000FE(0x00000008, 0x000000006, 0x00000009, 0x847075cc)",
    "Welcome. | Thanks for checking in. | This web is for personal use and educational purposes only. | I will not be saving any personal information of you as is not required for the website to perform properly. | You will now be redirected to a home page with multiple options and projects that i have been working on for some time. | The web will now start loading.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|  ",
    //"$$22444336688833664443666 2 6444 93322 22332233, 4777222244427777 7666777 888444777744482777633!! 833 26666 6.255522337778666, 8866 2233777729999666, 3288833 <3"
];

// Speed (in milliseconds) of typing.
var speedForward = 20, //Typing Speed
    speedWait = 600, // Wait between typing and backspacing
    speedBetweenLines = 400, //Wait between first and second lines
    speedBackspace = 10; //Backspace Speed

//Run the loop
typeWriter("output", textArray);

function typeWriter(id, ar) {
    var element = $("#" + id),
        aString = ar[a],
        eHeader = element.children("h1"), //Header element
        eParagraph = element.children("h1"); //Subheader element

    // Determine if animation should be typing or backspacing
    if (!isBackspacing) {

        // If full string hasn't yet been typed out, continue typing
        if (i < aString.length) {

            // If character about to be typed is a pipe, switch to second line and continue.
            if (aString.charAt(i) == "|") {
                isParagraph = true;
                eHeader.removeClass("cursor");
                eParagraph.addClass("cursor");
                i++;
                setTimeout(function () { typeWriter(id, ar); }, speedBetweenLines);

                // If character isn't a pipe, continue typing.
            } else {
                // Type header or subheader depending on whether pipe has been detected
                if (!isParagraph) {
                    eHeader.text(eHeader.text() + aString.charAt(i));
                } else {
                    eParagraph.text(eParagraph.text() + aString.charAt(i));
                }
                i++;
                setTimeout(function () { typeWriter(id, ar); }, speedForward);
            }

            // If full string has been typed, switch to backspace mode.
        } else if (i == aString.length) {

             isBackspacing = true;
             setTimeout(function () { typeWriter(id, ar); }, speedWait);

        }

        // If backspacing is enabled
    } else {

        // If either the header or the paragraph still has text, continue backspacing
        if (eHeader.text().length > 0 || eParagraph.text().length > 0) {

            // If paragraph still has text, continue erasing, otherwise switch to the header.
            if (eParagraph.text().length > 0) {
                eParagraph.text(eParagraph.text().substring(0, eParagraph.text().length - 1));
            } else if (eHeader.text().length > 0) {
                eParagraph.removeClass("cursor");
                eHeader.addClass("cursor");
                eHeader.text(eHeader.text().substring(0, eHeader.text().length - 1));
            }
            setTimeout(function () { typeWriter(id, ar); }, speedBackspace);

            // If neither head or paragraph still has text, switch to next quote in array and start typing.
        } else {

            isBackspacing = false;
            i = 0;
            isParagraph = false;
            a = (a + 1) % ar.length; //Moves to next position in array, always looping back to 0
            setTimeout(function () { typeWriter(id, ar); }, 50);

        }
    }
}
