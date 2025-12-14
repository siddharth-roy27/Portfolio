/* ===================================
 * main.c
 * STM32F407 Industrial Controller
 * =================================== */

#include "main.h"
#include "freertos_tasks.h"
#include "safety_manager.h"
#include "motor_control.h"
#include "sensor_manager.h"
#include "comms_ethercat.h"

int main(void)
{
    HAL_Init();
    SystemClock_Config();

    MX_GPIO_Init();
    MX_DMA_Init();
    MX_ADC1_Init();
    MX_SPI3_Init();
    MX_I2C1_Init();
    MX_USART2_UART_Init();
    MX_CAN1_Init();
    MX_TIM1_Init();
    MX_TIM2_Init();
    MX_TIM3_Init();
    MX_TIM4_Init();
    MX_TIM5_Init();
    MX_SDIO_Init();
    MX_USB_OTG_FS_PCD_Init();
    MX_FREERTOS_Init();

    vTaskStartScheduler();

    while (1) { }
}
