/* sensor_manager.c */
#include "sensor_manager.h"
#include "adc.h"
#include "spi.h"
#include "i2c.h"

void TaskSensorUpdate(void *argument)
{
    for (;;) {
        Read_IMU();
        vTaskDelay(pdMS_TO_TICKS(5));
    }
}
