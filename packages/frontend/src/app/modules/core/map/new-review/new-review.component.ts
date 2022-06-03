import { Component, OnInit } from '@angular/core';
import { ReviewService } from "../../../../services/map/review.service";
import { NzMarks } from "ng-zorro-antd/slider";
import { BehaviorSubject, Subject } from "rxjs";
import { ICommentFormModel, IReviewEstimationModel } from "../../../../services/map/map.types";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MainLayoutService } from "../../../../services/main-layout.service";

enum EStepperActions {
  GOTO_FEATURE_STEP = 0,
  GOTO_ESTIMATION_STEP = 1,
  GOTO_COMMENT_STEP = 2,
  SUBMIT_REVIEW = 3,
}

@Component({
  selector: 'app-new-review',
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.scss']
})
export class NewReviewComponent implements OnInit {
  public currentStep = new BehaviorSubject<EStepperActions>(0)
  /** Деактивирована ли кнопка перехода на следующий шаг */
  public is_next_button_disabled$ = new Subject<boolean>()

  /** Размер шага выбора */
  public select_step: number = 25;
  public marks: NzMarks = {
    0: 'Terrible',
    25: 'Bad',
    50: 'Normal',
    75: 'Good',
    100: 'Perfect'
  }

  public estimationFormModel: IReviewEstimationModel = {
    road_quality: 0,
    travel_safety: 0,
    road_congestion: 0
  }

  public commentFormModel: ICommentFormModel = {
    text: ""
  }

  private _estimateValidateForm: FormGroup;

  index = 'First-content';

  pre(): void {
    this.currentStep.next(this.currentStep.value - 1)
  }
  next(): void {
    this.currentStep.next(this.currentStep.value + 1)
  }
  done(): void {
    this.currentStep.next(EStepperActions.SUBMIT_REVIEW)
  }

  constructor(public reviewService: ReviewService, private fb: FormBuilder, private layoutService: MainLayoutService) {
    this.currentStep.subscribe((stepId) => {
      console.log("Step changed", stepId);
      this.changeContent(stepId)
    })

    // TODO пока не работает
    this._estimateValidateForm = this.fb.group({
      road_quality: [null, [Validators.required]],
      travel_safety: [null, [Validators.required]],
      road_congestion: [null, [Validators.required]],
    })
  }

  async changeContent(currentStep: EStepperActions): Promise<void> {
    switch (currentStep) {
      case EStepperActions.GOTO_FEATURE_STEP: {

        break;
      }
      case EStepperActions.GOTO_ESTIMATION_STEP: {
        this.reviewService.createOrUpdateFeature();
        if (this.reviewService.current_estimation) {
          Object.assign(this.estimationFormModel, (this.reviewService.current_estimation_data))
        }
        break;
      }
      case EStepperActions.GOTO_COMMENT_STEP: {
        await this.reviewService.createOrUpdateEstimation(this.estimationFormModel)
        if (this.reviewService.current_comment) {
          Object.assign(this.commentFormModel, this.reviewService.current_comment_data)
        }
        break;
      }
      case EStepperActions.SUBMIT_REVIEW: {
        await this.reviewService.createOrUpdateComment(this.commentFormModel)
        const is_submitted_successfully = await this.reviewService.submitReview()
        console.log('is_submitted_successfully', is_submitted_successfully);
        if (is_submitted_successfully) {
          this.clearStepper()
          this.layoutService.isNewReviewOpened$.next(false)
        }
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  ngOnInit(): void {
  }

  clearSelectedPath() {
    this.reviewService.clearPath()
  }

  private clearStepper() {
    this.currentStep.next(0)
  }
}
