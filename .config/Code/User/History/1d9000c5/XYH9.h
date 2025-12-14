/* motor_control.h */
#ifndef MOTOR_CONTROL_H
#define MOTOR_CONTROL_H
#include "stm32f4xx_hal.h"
#include "pid_controller.h"
void TaskMotorControl(void *argument);
void Motor_SetDuty(float duty_left, float duty_right);
#endif
