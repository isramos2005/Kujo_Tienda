import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages-register',
  templateUrl: './pages-register.component.html',
  styleUrls: ['./pages-register.component.css']
})
export class PagesRegisterComponent implements OnInit {
  currentTab = 0;

  ngOnInit(): void {
    this.showTab(this.currentTab);
  }

  showTab(n: number): void {
    const x = document.getElementsByClassName("tab");
    (x[n] as HTMLElement).style.display = "block";

    const prevBtn = document.getElementById("prevBtn") as HTMLButtonElement;
    const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;

    if (n === 0) {
      prevBtn.style.display = "none";
    } else {
      prevBtn.style.display = "inline";
    }

    if (n === x.length - 1) {
      nextBtn.innerHTML = "Submit";
    } else {
      nextBtn.innerHTML = "Next";
    }

    this.fixStepIndicator(n);
  }

  nextPrev(n: number): void {
    const x = document.getElementsByClassName("tab");

    if (n === 1 && !this.validateForm()) {
      return;
    }

    (x[this.currentTab] as HTMLElement).style.display = "none";
    this.currentTab += n;

    if (this.currentTab >= x.length) {
      const regForm = document.getElementById("regForm") as HTMLFormElement;
      regForm.submit();
      return;
    }

    this.showTab(this.currentTab);
  }

  validateForm(): boolean {
    let x: HTMLCollectionOf<Element>;
    let y: HTMLCollectionOf<Element>;
    let i: number;
    let valid = true;

    x = document.getElementsByClassName("tab");
    y = (x[this.currentTab] as HTMLElement).getElementsByTagName("input");

    for (i = 0; i < y.length; i++) {
      if ((y[i] as HTMLInputElement).value === "") {
        (y[i] as HTMLElement).className += " invalid";
        valid = false;
      }
    }

    if (valid) {
      (document.getElementsByClassName("step")[this.currentTab] as HTMLElement).className += " finish";
    }

    return valid;
  }

  fixStepIndicator(n: number): void {
    const x = document.getElementsByClassName("step");

    for (let i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }

    (x[n] as HTMLElement).className += " active";
  }
}
