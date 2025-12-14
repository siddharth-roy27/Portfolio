/* sensor_manager.h */
#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H
void TaskSensorUpdate(void *argument);
float Encoder_GetSpeed(void);
float Read_IMU(void);
#endif
