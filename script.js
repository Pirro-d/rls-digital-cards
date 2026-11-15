

const contact = {
  firstName: "Edgar",
  lastName: "Perez",
  title: "Engineer Management",
  company: "Resilient Life Safety IQ",
  phone: "+13136185979",
  email: "edgar@rlsiq.com",
  website: "https://rlsiq.com/",
  facebook: "",
  instagram: "",
  linkedin: ""
};

const notice = document.getElementById("notice");

function setLink(id, value, prefix = "") {
  const el = document.getElementById(id);
  if (!el) return;

  if (value) {
    el.href = prefix + value;

    if (value.startsWith("https://")) {
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
} else {
  el.addEventListener("click", function (event) {
    event.preventDefault();
  });
}
}

setLink("callLink", contact.phone, "tel:");
setLink("emailLink", contact.email, "mailto:");
setLink("websiteLink", contact.website);
setLink("facebookLink", contact.facebook);
setLink("instagramLink", contact.instagram);
setLink("linkedinLink", contact.linkedin);

function escapeVcard(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

async function getContactPhoto() {
  const response = await fetch(
    "images/RLS_DBC_logo_conatct.png"
  );

  if (!response.ok) {
    throw new Error("Could not load contact logo");
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const saveButton = document.getElementById("saveContact");

if (saveButton) {
  saveButton.addEventListener("click", async function () {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${escapeVcard(contact.lastName)};${escapeVcard(contact.firstName)};;;`,
      `FN:${escapeVcard(contact.firstName + " " + contact.lastName)}`,
      `ORG:${escapeVcard(contact.company)}`,
      `TITLE:${escapeVcard(contact.title)}`
		
		
    ];

    if (contact.phone) {
      lines.push(`TEL;TYPE=CELL:${contact.phone}`);
    }

    if (contact.email) {
      lines.push(`EMAIL;TYPE=WORK:${contact.email}`);
    }

    if (contact.website) {
      lines.push(`URL:${contact.website}`);
    }
	  
	  
try {
  const photo = await getContactPhoto();
  const photoLine = "PHOTO;ENCODING=b;TYPE=PNG:" + photo;
  const foldedPhoto = photoLine.match(/.{1,70}/g).join("\r\n ");
  lines.push(foldedPhoto);
} catch (error) {
  console.error("Contact photo error:", error);
}

lines.push("END:VCARD");
	  
    const vcf = lines.join("\r\n") + "\r\n";

    const blob = new Blob([vcf], {
      type: "text/vcard;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Edgar_Perez.vcf";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);


  });
}
