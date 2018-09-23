export default class Utils {
  public static sendGetRequest(endpoint: string, callback: (response: string) => void) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', endpoint, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.onreadystatechange = () => {
      // wait until response was loaded
      if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        callback(xhttp.responseText)
      }
    };
    xhttp.send();
  }

  public static sendPutRequest(endpoint: string, body: string) {
    // tslint:disable-next-line:no-console
    console.log(endpoint);
    // tslint:disable-next-line:no-console
    console.log(body);
    const xhttp = new XMLHttpRequest();
    xhttp.open('PUT', endpoint, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.onreadystatechange = () => {
      // wait until response was loaded
      if (xhttp.readyState === 4 && xhttp.status !== 200) {
        // tslint:disable-next-line:no-console
        console.log(xhttp.responseText)
      }
    };
    xhttp.send(body);
  }
}
