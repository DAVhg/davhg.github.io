// values to keep track of the number of letters typed, which quote to use. etc. Don't change these values.
var i = 0,
    a = 0,
    isBackspacing = false,
    isParagraph = false;

// Typerwrite text content. Use a pipe to indicate the start of the second line "|".  
var textArray = [
    "",
    "|||||||||",
    "6444 660666062277733 337777 328884443 44337770777337772 427772224442 |||",
    "3377778666 337777 8866 33662227774447823666777 333 833998666 77773366222444555555666 333 2555466677744486666 78822555444222666, 7777444 33377773327777 777722233777 2226666666 3338866222444666662, 4429999 22255544422255 3366 33555 22666866666 333 44466333666",
    //"A problem has been detected and Windows has been shut down to prevent damage to your computer. | If this is the first time you've seen this stop error screen, restart your computer. if this screen appears again, follow these steps: | Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for and Windows updates you might need. | If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing. If you need to use Safe Mode to remove or disable components, restart your computer, press F8 to select Advanced Startup Options, and then select Safe Mode. | Technical information: | *** STOP: 0x000000FE(0x00000008, 0x000000006, 0x00000009, 0x847075cc)",
    //"Welcome. | Thanks for checking in. | This web is for personal use and educational purposes only. | I will not be saving any personal information of you as is not required for the website to perform properly. | You will now be redirected to a home page with multiple options and projects that I have been working on for some time. | The web will now start loading.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|  ",
];

// Speed (in milliseconds) of typing.
var speedForward = 70, //Typing Speed
    speedWait = 2000, // Wait between typing and backspacing
    speedBetweenLines = 100, //Wait between first and second lines
    speedBackspace = 20; //Backspace Speed

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