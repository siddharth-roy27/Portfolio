/* pid_controller.h */
#ifndef PID_CONTROLLER_H
#define PID_CONTROLLER_H
typedef struct {
    float Kp, Ki, Kd;
    float prev_error, integral, dt;
    float min, max;
} PID_t;
float PID_Update(PID_t *pid, float setpoint, float measurement);
#endif
