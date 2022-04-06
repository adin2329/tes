import React from "react";
import "./styles.css";
import { QRCode } from "react-qrcode-logo";
import logo from "./123.png";
class App extends React.Component {
  state = {
    startTimer: true,
    coverpage: true,
    account: "",
    total_amount: "",
    each_amount: "100",
    bank_code: "",
    number_of_people: "",
    UFT: "",
    comment: "",
    pngURL: ""
  };
  set_account = (account) => {
    this.setState({ account: account });
  };
  set_total_amount = (amount) => {
    this.setState({ total_amount: amount });
  };
  BANK_code = (bank_code) => {
    this.setState({ bank_code: bank_code });
  };
  set_number_of_people = (number) => {
    this.setState({ number_of_people: number });
  };
  get_comment = (comment) => {
    this.setState({ comment: comment });
  };

  //產生轉帳QR code
  generate_QRcode = () => {
    var str =
      "TWQRP://個人轉帳/158/02/V1?D1=" +
      this.state.each_amount +
      "00&D5=" +
      this.state.bank_code +
      "&D6=" +
      this.state.account +
      "&D10=901";
    this.setState({ UFT: encodeURIComponent(str) });
  };
  //產生轉帳QR code END

  // 檢查資料
  check_data = (divide_type) => {
    if (this.state.bank_code === "") {
      alert("您的轉入行代碼為空白");
      return;
    }
    if (this.state.account === "") {
      alert("請填入匯款帳號");
      return;
    }
    if (this.state.total_amount === "") {
      alert("請填入金額");
      return;
    }
    if (this.state.total_amount === "0") {
      alert("金額最低請填1元");
      return;
    }
    if (this.state.number_of_people === "") {
      alert("請填入平分人數");
      return;
    }
    if (this.state.number_of_people === "0") {
      alert("人數最低請填1人");
      return;
    }
    // 確認帳號為16碼
    let account = this.state.account.replace("-", "");
    while (account.length < 16) {
      account = "0" + account;
    }
    // 確認帳號為16碼 END

    // 均分價錢
    var each_amount;
    if (divide_type === 1) {
      each_amount = Math.floor(
        Number(this.state.total_amount) / Number(this.state.number_of_people)
      );
    } else {
      each_amount = Math.ceil(
        Number(this.state.total_amount) / Number(this.state.number_of_people)
      );
    }
    // 均分價錢 END

    this.setState(
      { account: account, each_amount: each_amount },
      this.generate_QRcode()
    );
  };
  // 檢查資料 END
  //  下載CRcode
  Combine_canvas = () => {
    var canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 500;

    var qrcanvas = document.getElementById("react-qrcode-logo");

    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(qrcanvas, 0, 0, 400, 400);
    // 元
    var text = this.state.each_amount + "元";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "bold 60px Arial";
    ctx.fillText(text, 210, 440);
    // 備註
    text = this.state.comment;
    ctx.fillStyle = "#b5838d";
    ctx.font = "bold 25px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, 190, 470);
    return canvas;
  };

  downloadQR = () => {
    const canvas = this.Combine_canvas();
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    console.log(pngUrl);

    this.setState({ pngURL: pngUrl });
    // // 下載的CODE
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "1234.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    // 下載的CODE end
  };
  //  下載CRcodeEND

  render = () => {
    let coverMain;
    if (this.state.startTimer) {
      this.setState({ startTimer: false });
      setTimeout(() => {
        this.setState({ coverpage: false });
      }, 2000);
    }

    coverMain = this.state.coverpage ? (
      <div className="Coverlogo" />
    ) : (
      <div className="inputpage">
        <div className="left">
          <div className="oneRow">
            <div className="bankNo"> 收款帳號 </div>
          </div>

          <div className="twoRow">
            <input
              type="number"
              placeholder="銀行代碼"
              style={{ height: 30, width: 120 }}
              onChange={(e) => this.BANK_code(e.target.value)}
            />
            <input
              type="number"
              placeholder="帳號"
              style={{ height: 30, width: 250, marginLeft: 15 }}
              onChange={(e) => this.set_account(e.target.value)}
            />
          </div>

          <div className="threeRow">
            <div className="money">分帳人數與金額 </div>
          </div>

          <div className="fourRow">
            <input
              type="number"
              placeholder="分帳人數...."
              style={{ height: 30, width: 120 }}
              onChange={(e) => this.set_number_of_people(e.target.value)}
            />
            <input
              type="number"
              placeholder="分帳金額...."
              style={{ height: 30, width: 220, marginLeft: 10 }}
              onChange={(e) => this.set_total_amount(e.target.value)}
            />
            <img
              src="https://cdn3.iconfinder.com/data/icons/workplace-filled-line/100/Workplace_expanded_caculator-256.png"
              alt="caculator"
              width="38px"
              height="38px"
            />
          </div>

          <div className="fiveRow">
            <div className="submit" onClick={() => this.check_data(0)}>
              {" "}
              餘額進位{" "}
            </div>
            <div className="submit" onClick={() => this.check_data(1)}>
              {" "}
              餘額捨去{" "}
            </div>
          </div>
        </div>
        <div className="right">
          <div className="QRcode">
            <QRCode
              value={this.state.UFT}
              style={{ width: 195, height: 195, padding: 30 }}
              enableCORS={true}
              logoImage={{
                src: "http://glassbeat.id/assets/company-logo/main-logo.png"
              }}
              size="200"
            />
          </div>
          <div className=" annotation">收款金額為：</div>{" "}
          {this.state.each_amount}
          <input
            type="text"
            onChange={(e) => this.get_comment(e.target.value)}
          />
          <input type="submit" value="下載" onClick={() => this.downloadQR()} />
        </div>
      </div>
    );

    return (
      <div className="App">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <div className="Cover">
          <div className="Covertitle" />
          <div className="Coverpage">{coverMain}</div>
        </div>
      </div>
    );
  };
}
export default App;
