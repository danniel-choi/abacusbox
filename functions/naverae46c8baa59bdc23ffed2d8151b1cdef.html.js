const verificationText = "naver-site-verification: naverae46c8baa59bdc23ffed2d8151b1cdef.html";

export function onRequestGet() {
  return new Response(`${verificationText}\n`, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate"
    }
  });
}
