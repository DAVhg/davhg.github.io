// values to keep track of the number of letters typed, which quote to use. etc. Don't change these values.
var i = 0,
    a = 0,
    isBackspacing = false,
    isParagraph = false;

// Typerwrite text content. Use a pipe to indicate the start of the second line "|".  
var textArray = [
    "",
    "||||||||||||||||",
    //"A problem has been detected and Windows has been shut down to prevent damage to your computer. | If this is the first time you've seen this stop error screen, restart your computer. if this screen appears again, follow these steps: | Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for and Windows updates you might need. | If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing. If you need to use Safe Mode to remove or disable components, restart your computer, press F8 to select Advanced Startup Options, and then select Safe Mode. | Technical information: | *** STOP: 0x000000FE(0x00000008, 0x000000006, 0x00000009, 0x847075cc)",
    //"Welcome. | Thanks for checking in. | This web is for personal use and educational purposes only. | I will not be saving any personal information of you as is not required for the website to perform properly. | You will now be redirected to a home page with multiple options and projects that I have been working on for some time. | The web will now start loading.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|  ",
    "Welcome to 5 hours of loops. Starting now. @echo == ApplyRecovery.bat == | @rem ************ | @echo Checking to see if the PC is booted in BIOS or UEFI mode. | wpeutil UpdateBootInfo | for /f tokens = 2 * delims=  %%A in ('reg query HKLM\System\CurrentControlSet\Control /v PEFirmwareType') DO SET  |Firmware=%%B | @echo Note: delims is a TAB followed by a space. | @if x%Firmware%==x echo ERROR: Can't figure out which firmware we're on. | @if x%Firmware%==x echo        Common fix: In the command above: | @if x%Firmware%==x echo for /f tokens = 2 * delims= | @if x%Firmware%==x echo        ...replace the spaces with a TAB character followed by a space. | @if x%Firmware%==x goto END | @if %Firmware%==0x1 echo The PC is booted in BIOS mode. | @if %Firmware%==0x2 echo The PC is booted in UEFI mode.  | @echo  ******************** | @echo Do you already have a recovery partition on this disk? (Y or N): | @SET /P RECOVERYEXIST=(Y or N): | @if %RECOVERYEXIST%.==y. set RECOVERYEXIST=Y | @if %RECOVERYEXIST%.==Y. GOTO COPYTOTOOLSPARTITION | @if not %RECOVERYEXIST%.==Y. GOTO CREATEFFURECOVERY | @echo  ****************** |: COPYTOTOOLSPARTITION | @echo  == Copy the Windows RE image to the Windows RE Tools partition == | md R: \Recovery\WindowsRE | xcopy / h W: \Windows\System32\Recovery\Winre.wim R: \Recovery\WindowsRE\ | @echo  ********************************************************************* | @echo  == Register the location of the recovery tools == | W: \Windows\System32\Reagentc / Setreimage / Path R: \Recovery\WindowsRE / Target W: \Windows | @echo  ********************************************************************* | @IF EXIST W: \Recovery\Customizations\USMT.ppkg(GOTO CUSTOMDATAIMAGEWIM) else goto HIDEWIMRECOVERYTOOLS | : CUSTOMDATAIMAGEWIM | @echo  == If Compact OS, single - instance the recovery provisioning package == | @echo. | @echo     *Note: this step only works if you created a ScanState package called @echo      USMT.ppkg as directed in the OEM Deployment lab. If you aren't @echo      following the steps in the lab, choose N. @echo.       @echo     Options: N: No @echo              Y: Yes @echo              D: Yes, but defer cleanup steps to first boot. @echo                 Use this if the cleanup steps take more than 30 minutes. @echo                 defer the cleanup steps to the first boot. @SET /P COMPACTOS=Deploy as Compact OS? (Y, N, or D): @if %COMPACTOS%.==y. set COMPACTOS=Y @if %COMPACTOS%.==d. set COMPACTOS=D @if %COMPACTOS%.==Y. dism /Apply-CustomDataImage /CustomDataImage:W:\Recovery\Customizations\USMT.ppkg /ImagePath:W:\ /SingleInstance @if %COMPACTOS%.==D. dism /Apply-CustomDataImage /CustomDataImage:W:\Recovery\Customizations\USMT.ppkg /ImagePath:W:\ /SingleInstance /Defer @echo  ********************************************************************* :HIDEWIMRECOVERYTOOLS @echo == Hiding the recovery tools partition if %Firmware%==0x1 diskpart /s %~dp0HideRecoveryPartitions-BIOS.txt if %Firmware%==0x2 diskpart /s %~dp0HideRecoveryPartitions-UEFI.txt @echo ********************************************************************* @echo == Verify the configuration status of the images. == W:\Windows\System32\Reagentc /Info  Target W:\Windows @echo    (Note: Windows RE status may appear as Disabled, this is OK.) @echo ********************************************************************* @echo      All done! @echo      Disconnect the USB drive from the reference device. @echo      Type exit to reboot. @echo. GOTO END :CREATEFFURECOVERY @echo ********************************************************************* @echo == Creating the recovery tools partition @if %Firmware%==0x1 diskpart /s CreateRecoveryPartitions-BIOS.txt @if %Firmware%==0x2 diskpart /s CreateRecoveryPartitions-UEFI.txt @echo finding the Windows Drive @echo  ********************************************************************* @IF EXIST C:\Windows SET windowsdrive=C:\ @IF EXIST D:\Windows SET windowsdrive=D:\ @IF EXIST E:\Windows SET windowsdrive=E:\ @IF EXIST W:\Windows SET windowsdrive=W:\ @echo The Windows drive is %windowsdrive% md R: \Recovery\WindowsRE @echo  ********************************************************************* @echo Finding Winre.wim @IF EXIST % windowsdrive % Recovery\WindowsRE\winre.wim SET recoveryfolder =% windowsdrive % Recovery\WindowsRE\ @IF EXIST % windowsdrive % Windows\System32\Recovery\winre.wim SET recoveryfolder =% windowsdrive % Windows\System32\Recovery\ @echo  ********************************************************************* @echo copying Winre.wim xcopy / h % recoveryfolder % Winre.wim R: \Recovery\WindowsRE\ @echo  *********************************************************************",
];

// Speed (in milliseconds) of typing.
var speedForward = 10, //Typing Speed
    speedWait = 10, // Wait between typing and backspacing
    speedBetweenLines = 100, //Wait between first and second lines
    speedBackspace = 1; //Backspace Speed

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