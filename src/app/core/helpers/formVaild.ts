import {
  FormGroup,
  ValidationErrors,
  FormControl,
  FormArray,
} from "@angular/forms";
//import { UploadFileService } from "../../sevices/upload-file/uploadfile.service";

export abstract class FormManage {
  private form: FormGroup;
  constructor() {}

  setForm(form) {
    this.form = form;
  }
  markAllFeildsTouched(formGroup = this.form) {
    // Object.keys(this.form.controls).forEach((key) => {
    //   if (key !== "items") {
    //     this.form.controls[key].markAsTouched();
    //   }
    // });

    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field) as
        | FormControl
        | FormGroup
        | FormArray;
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.markAllFeildsTouched(control);
      } else if (control instanceof FormArray) {
        this.markFormArrayControlsAsTouched(control);
      }
    });
  }

  // Get FormArray and mark as touched
  markFormArrayControlsAsTouched(formArray: FormArray) {
    formArray.controls.forEach((formArrayControl) => {
      if (formArrayControl instanceof FormControl) {
        formArrayControl.markAsTouched({ onlySelf: true });
      } else if (formArrayControl instanceof FormGroup) {
        this.markAllFeildsTouched(formArrayControl);
      } else if (formArrayControl instanceof FormArray) {
        this.markFormArrayControlsAsTouched(formArrayControl);
      }
    });
  }

  isFieldValid(
    ControlName: string,
    formGroupName?: string,
    formArrayName?: string,
    controlIndex?: number
  ) {
    if (formArrayName) {
      if (ControlName) {
        const formGroup = (this.form.get(formArrayName) as FormArray).controls[
          controlIndex
        ] as FormGroup;
        return (
          formGroup.controls[ControlName].touched &&
          formGroup.controls[ControlName].invalid
        );
      } else {
        const formArray = (this.form.get(formArrayName) as FormArray).controls;
        return (
          formArray[controlIndex].touched && formArray[controlIndex].invalid
        );
      }
    } else if (formGroupName) {
      return (
        (this.form.controls[formGroupName] as FormGroup).controls[ControlName]
          .touched &&
        (this.form.controls[formGroupName] as FormGroup).controls[ControlName]
          .invalid
      );
    } else {
      return (
        this.form.controls[ControlName].touched &&
        this.form.controls[ControlName].invalid
      );
    }
  }
  setContollerValue(name: string, value: any) {
    this.form.controls[name].setValue(value);
  }
  getFormValidationErrors() {
    Object.keys(this.form.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            "Key control: " + key + ", keyError: " + keyError + ", err value: ",
            controlErrors[keyError]
          );
        });
      }
    });
  }
  get isFormValid() {
    this.markAllFeildsTouched();
    return this.form.valid;
  }
  get FormValue() {
    return this.form.value;
  }
  resetForm() {
    this.form.reset();
  }
  setFormErrors(errors) {
    Object.keys(errors).forEach((error) => {
      if (this.form.controls[error]) {
        this.form.controls[error].setErrors({ incorrect: true });
      }
    });
  }
  /**
   * set data to the form
   * @param data
   */
  setDataToForm(data) {
    Object.keys(data).forEach((key) => {
      if (this.form.controls[key]) {
        if (data[key] == 0) {
          JSON.stringify(data[key]);
        }
        this.setContollerValue(key, data[key]);
      }
    });
  }
  addControllerTOTheForm(name, data, validators = []) {
    this.form.addControl(name, new FormControl(data, validators));
  }
  removeControllerFromTheForm(name) {
    this.form.removeControl(name);
  }

  getControllerValue(name) {
    if (this.form.controls[name]) return this.form.controls[name].value;
  }
  getFormFieldErrors(name) {
    const controlErrors: ValidationErrors = this.form.controls[name].errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach((keyError) => {
        console.log(
          "Key control: " + name + ", keyError: " + keyError + ", err value: ",
          controlErrors[keyError]
        );
      });
    }
    return controlErrors;
  }
}
