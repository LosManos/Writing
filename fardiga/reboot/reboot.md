# Reboot
## Preludium
Det hela började när jag skulle RAS:a till jobbet men fick en felkod på sexhundra som betydde att porten var upptagen eller att RAS inte var inkopplat. Modemet funkade och portarna med men inte RAS. Jag installerade om RAS och avinstallerade RAS och installerade på det. Mellan det bytte jag protokoll fram och tillbaka. Betänk nu att varje protokollbyte på RAS under NT följs av en om-boot så... jag vet inte vad men betänk det i alla fall.

Inget ont utan något gott med sig, nu skulle jag äntligen få tummen ur att installera NT5 beta2 men icke sa Nicke. Hårddisken full, 350 meg saknades. Jag har inget annat än Windows95 och NT4 på C:-driven som tog 850 meg!  
Har ni någon gång använt det installationsprogrammet som vid avinstallering säger "Alla filer kunde inte tas bort så det får du göra själv."? De kunde lika gärna lagt till "Blä blä".  
Vilka filer är det som inte kan avinstalleras? Och varför? Jag har sett det programmet massor med gånger och tydligen på min maskin också, för nu hade jag en C:-drive på 1 gig med 850 meg OS. Vartenda program jag har någon gång installerat och avinstallerat har lämnat DLL:er i System32.  
Jag raderade Windows95. Hejdå Voodoo2. Hejdå Force Feedback. Hejdå DirectX6 som fungerar.

Det saknades fortfarande 150 meg. Tvivlet infann sig. Tvivlet gnagde. Skulle jag, skulle jag inte? Att installera om NT tar minst sagt långt tid och vilka OS skulle jag ha? NT4 var självskrivet. Win95 också för Voodoo2, ForceFeedback och tidiga releaser av DirectX6. DOS är jag för gammal för och LINUX kan jag inte stava till. Macen har för tetigt användargränsnitt och dessutom har jag ännu inte fått releasen för intel. OS/2 är lika dött som Newton-OS. BeOS och VMS? nja.
## Kontrapunkt
Jag hittade en diskett som jag kom åt CD:n med. Bra, för utan den vågar jag inte starta. Kommer ni ihåg MSCDEX, EMM386 och ATAPI? Det gör jag.

Jag stoppade in en Windows 95 , eller Windows 97 som de kallade den för det var service pack 2 (service patch) på den, och tog mig till katalogen WINDOW~1. Vet ni var tilde finns på ett amerikansk tangentbord?
Inte? Shift-till vänster om 1. Bättre än alt-gr höger-om-å i.o.f.s.  
WINDOW~1 skriver jag med versaler för det ser så ut i DOS. Ok, ok, jag får dåligt samvete; jag ljög för er. Windows 97 heter det inte för patch nummer två utan för att den är köpt i Hong Kong för det facila priset 25 HK$. Full returrätt om den inte funkar, de trycker en ny bara. Jag fick också med Office97, Painter5, Photoshop4/MMX, Wonder Chinese-English translate &amp; dictionary, Twain Chinese OCR Pro, Eudora3, QEMM98 och lite till. Tillverkare var Piracy Union HK och på framsidan stod det "Report Using Piracy Software call Tel: Nine 99 for Help". Man kunde köpa bara Windows95 också för samma pris om man ville. Med kvitto. Men momsen ville de inte spec:a. 320 filer fanns det i den katalogen.  
Var börja? Setup.exe? Testa, et voila! Lite självtest och bös att vänta på tills... scandisk hängde sig på E:.  
Boota om. Körde Setup.exe igen. Samma resultat. :-( Det brukar ju fungera. Jag provade chkdsk och den rapporterade fel på varenda fil men också att den åtgärdade det. Jag tittade på skärmen i 5 minuter (Fascinerande hur man kan sitta och titta på text som rullar förbi. Jag saknar de gamla matrisskrivarna där man samtidigt fick ett ljud att se visionen till. Som en popvideo fast med innehåll.)  
chkdsk (Jag skriver med gemen i början av meningen för man skriver filer med gemener i DOS.) avslutade med något divisionsfel. Jag är ledsen att jag inte kan meddela er vad det var för divisionsfel för på det glada 90-talet (Kom ihåg vem som myntade uttrycket "glada 90-talet" nu!) med sin localizing (Jag kan inte förmå mig att skriva lokalisering.) översatte de också rena programmeringstermer till lokalt språk, d.v.s. svenska, och jag kan inte komma ihåg en division overflow på svenska.  
Jag startade om chkdsk med parameter /F som skall laga felen. Samma ljudlösa resultat. chkdsk verkade fallera för att hårddisken var ur synk. Hurra:-( 
Jag bestämde mig för att formattera men det gick inte heller av någon annan orsak som inte hade något namn alls. Möjlitvis var det siffran 7 som som var felsträng. Nej, det var nog om man startar xcopy med bara ett kolon som parameter.

Innan formatteringen tyckte jag mig tvungen att rädda data och behövde därför xcopy men det enda stället jag hittade den var som packad på DOS-installationsdisketterna och inte tänkte jag på expand.exe inte, så jag installerade. DOS 6.21. Den sägs vara den stabilaste så jag var inte orolig nu längre. Om-boot och kopiering av räddningsvärda data till C:-driven för att upptäcka att allt blev 0 bytes stort när det kom fram. Inte så konsitig upptäckte jag när källfilerna också var 0 bytes stora. Så jag tog fram min backup. Skojade bara. Jag har ingen sådan för sådant här händer inte mig. Inte med 3 års data inte.

Jag hittade filerna på en annan hårddisk. Hurra. Eftersom det inte gick att formattera fick jag göra fdisk. Farligt, farligt men härligt, härligt. Sedan formattering och döpning av hårddisken. HD3A blev den kristnad till.

F:\WINDOW~1\setup.exe och Windows97 var på väg in. Jag la den i en katalog som jag döpte till win97 (gemener för nu är det windows) för att minnas.

Windows97 var trevligt. Blått, grått och musstöd. Användarvänligt också. Inte bara point and click utan även drag and drop. Inte klokt vad man kan komma på när man flyttar papperskorgen från nedre högra hörnet till mitten vänster. : -)

### Bit i moll
Så jag installerade NT4 i WinNT. 3 ombootningar.

Prövade RAS och fick fel 633. Ett helt varv på 4 timmar. :-(

Men jag har plats ledigt på C-driven, 723 meg. Och det kan jag se utan att ta egenskaper/properties på ikonen för jag har ännu inte installerat IE4.

IE5 installerar jag. Men först SP4. Tydligen får jag SP1 för IE4, som jag inte har installerat, på köpet. Jag sitter här och studerar progress bar:en och ser att den tar backup. Det var väl omtänksamt. T.o.m. på typsnitten vilka jag är tämligen säker på inte berörs av SP4. Den installerar Winfile.exe! Genast känner jag att jag måste kolla om edlin finns under NT.

En liten anekdot medan jag väntar på omboot: Maskinen vägrade igår gå upp. Den kom till "Floppy A Installed" men inte längre. Så jag tog fram skruvmejsel, brottade ner maskinen på sidan och började lossa sladdar och kort för att se vad som hade brunnit. Vid en av ombootningarna hörde jag hur det skramlade i CD-driven. Jag öppnade och ut föll NT5 beta 2.  
Med NT5b2 i vägrar maskinen starta och maskinen har ingen CD-boot. Andra skivor kan den ha i utan att det märks.

Blue screen of death! Järnvägar. Kan det bero på att jag har fått SP1 för IE4 innan IE4 tro? Efter omboot gick maskinen upp. Tänk om det var lika enkelt att laga bilar...

Det berodde inte på SP1 för IE4 för den installationen gick igång nu precis. Jag avbröt den. En liten varningsskylt dök upp som sa åt mig att inte boota om. Det finns alltså tillfällen när installationen kan fallera. Jag menar...officiellt.

Maskinen bootar om igen.

Ojojoj, en ruta visar att den ställer in IE4. Hur skall det gå? IE4 dyker upp! Någon i Redmond vet mer än jag, jag böjer mig ner för att se om modemet omärkligt har slåtts på.

IE5. Är det någon som någon gång har läst licensavtalet man klickar i? Tänk om det står något skoj där.

Om Macromedia Flash står det "Super-dynamic, interactive, vector-based, animation, and sound.". De har tydligen aldrig jobbat i det. JVM har bytt namn till Microsoft Virtual Machine. Känn på den Sun.
  
Jag godkänner installationen på C:. 642 meg ledigt är den nere i kan jag se bakom dialogerna. Omboot igen.
  
Vad är det som orsakar RAS-felet? En service misslyckas vid uppstart men det har den gjort i ett år. Denna gången misslyckades den direkt efter installation vilket den inte gjorde för 2 år sedan då jag installerade förra gången. Jag får testa att skruva ut nätverkskortet och se om det hjälper, bara avinstallera drivrutinerna hjälper inte.
  
IE5 verkar inte ha Active Desktop startad som default. IE5 har lite lättare menyer. Även om det inte säger så mycket om man har försökt leta upp något i IE4:s menyer. Eller vad sägs om att hitta knappen för att tömma cachen under Internet Options. Det är lite som Word där man infogar alla objekt utom tabeller i Infoga-menyn. För den har en egen meny bredvid Verktyg som är där man lägger sådant som man inte vet var man skall ha. En bra-att-ha-låda.
  
Jag upptäckte gamla datakataloger på C-driven! 8-) Den jag hade formatterat! Hade NT eller IE förstått att de var viktiga och lyft dem till OS-driven? Efter ett tag dök det upp för mig att det var rester sedan jag hade försökt rädda de där filerna på 0 bytes. Pust. 600 meg ledigt.
## Post ludium

Nästa år återkommer jag med installationen av Visual Studio 6, Office 2000, SQLServer7, IIS och Visual Basic for Mac. 
