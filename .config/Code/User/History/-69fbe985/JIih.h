/* ================================================
 * main.h
 * STM32F407VG Industrial Controller Firmware
 * ================================================
 *  Board: STM32F407VG
 *  Framework: HAL + FreeRTOS
 *  Application: Industrial Tape / Flow Controller
 *  Author: Siddharth Roy
 * ================================================ */

#ifndef __MAIN_H
#define __MAIN_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include "stm32f4xx_hal.h"
#include "cmsis_os.h"
#include <stdbool.h>
#include <stdint.h>

/* ========================== USER INCLUDES =============================== */
#include "motor_control.h"
#include "pid_controller.h"
#include "sensor_manager.h"
#include "safety_manager.h"
#include "comms_ethercat.h"
#include "fault_table.h"
#include "state_machine.h"

/* ========================== SYSTEM CLOCK CONFIG ========================= */
void SystemClock_Config(void);

/* ========================== PERIPHERAL INITS ============================ */
void MX_GPIO_Init(void);
void MX_DMA_Init(void);
void MX_ADC1_Init(void);
void MX_SPI3_Init(void);
void MX_I2C1_Init(void);
void MX_USART2_UART_Init(void);
void MX_CAN1_Init(void);
void MX_TIM1_Init(void);
void MX_TIM2_Init(void);
void MX_TIM3_Init(void);
void MX_TIM4_Init(void);
void MX_TIM5_Init(void);
void MX_SDIO_Init(void);
void MX_USB_OTG_FS_PCD_Init(void);
void MX_FREERTOS_Init(void);

/* ========================== GLOBAL FLAGS ================================ */
extern volatile bool fault_active;
extern volatile bool comms_active;
extern volatile bool safety_ok;

/* ========================== PIN DEFINITIONS ============================= */

/* ------------- POWER & STATUS ------------- */
#define LED_STATUS_Pin           GPIO_PIN_13
#define LED_STATUS_GPIO_Port     GPIOC
#define LED_FAULT_Pin            GPIO_PIN_14
#define LED_FAULT_GPIO_Port      GPIOC
#define POWER_EN_Pin             GPIO_PIN_15
#define POWER_EN_GPIO_Port       GPIOC

/* ------------- MOTOR CONTROL ------------- */
#define TAPE_RPWM_Pin            GPIO_PIN_8
#define TAPE_RPWM_GPIO_Port      GPIOA     // TIM1_CH1
#define TAPE_LPWM_Pin            GPIO_PIN_9
#define TAPE_LPWM_GPIO_Port      GPIOA     // TIM1_CH2
#define PUMP_RPWM_Pin            GPIO_PIN_6
#define PUMP_RPWM_GPIO_Port      GPIOB     // TIM4_CH1
#define PUMP_LPWM_Pin            GPIO_PIN_7
#define PUMP_LPWM_GPIO_Port      GPIOB     // TIM4_CH2

#define SERVO_SIG_Pin            GPIO_PIN_0
#define SERVO_SIG_GPIO_Port      GPIOA     // TIM5_CH1

/* ------------- ENCODER INPUTS ------------- */
#define TAPE_ENC_A_Pin           GPIO_PIN_0
#define TAPE_ENC_A_GPIO_Port     GPIOA     // TIM2_CH1
#define TAPE_ENC_B_Pin           GPIO_PIN_1
#define TAPE_ENC_B_GPIO_Port     GPIOA     // TIM2_CH2
#define PUMP_ENC_A_Pin           GPIO_PIN_6
#define PUMP_ENC_A_GPIO_Port     GPIOA     // TIM3_CH1
#define PUMP_ENC_B_Pin           GPIO_PIN_7
#define PUMP_ENC_B_GPIO_Port     GPIOA     // TIM3_CH2

/* ------------- RS-422 (F/T SENSOR) ------------- */
#define RS422_TX_Pin             GPIO_PIN_2
#define RS422_TX_GPIO_Port       GPIOA     // USART2_TX
#define RS422_RX_Pin             GPIO_PIN_3
#define RS422_RX_GPIO_Port       GPIOA     // USART2_RX
#define RS422_DE_Pin             GPIO_PIN_1
#define RS422_DE_GPIO_Port       GPIOA     // TX enable
#define RS422_RE_Pin             GPIO_PIN_1
#define RS422_RE_GPIO_Port       GPIOA

/* ------------- SPI3 (IMU / ESC) ------------- */
#define SPI3_SCK_Pin             GPIO_PIN_3
#define SPI3_SCK_GPIO_Port       GPIOB
#define SPI3_MISO_Pin            GPIO_PIN_4
#define SPI3_MISO_GPIO_Port      GPIOB
#define SPI3_MOSI_Pin            GPIO_PIN_5
#define SPI3_MOSI_GPIO_Port      GPIOB
#define IMU_CS_Pin               GPIO_PIN_6
#define IMU_CS_GPIO_Port         GPIOB
#define IMU_INT_Pin              GPIO_PIN_1
#define IMU_INT_GPIO_Port        GPIOC

/* ------------- I2C1 (ToF Sensors via MUX) ------------- */
#define I2C1_SCL_Pin             GPIO_PIN_6
#define I2C1_SCL_GPIO_Port       GPIOB
#define I2C1_SDA_Pin             GPIO_PIN_7
#define I2C1_SDA_GPIO_Port       GPIOB

/* ------------- ADC (Current Sense / Flow) ------------- */
#define ADC_TAPE_CURR_Pin        GPIO_PIN_0
#define ADC_TAPE_CURR_GPIO_Port  GPIOB     // ADC1_IN8
#define ADC_PUMP_CURR_Pin        GPIO_PIN_1
#define ADC_PUMP_CURR_GPIO_Port  GPIOB     // ADC1_IN9
#define ADC_FLOW_Pin             GPIO_PIN_2
#define ADC_FLOW_GPIO_Port       GPIOC     // ADC1_IN12

/* ------------- ETHERNET (DP83848 PHY RMII) ------------- */
#define RMII_REF_CLK_Pin         GPIO_PIN_1
#define RMII_REF_CLK_GPIO_Port   GPIOA
#define RMII_MDIO_Pin            GPIO_PIN_2
#define RMII_MDIO_GPIO_Port      GPIOA
#define RMII_MDC_Pin             GPIO_PIN_1
#define RMII_MDC_GPIO_Port       GPIOC
#define RMII_CRS_DV_Pin          GPIO_PIN_7
#define RMII_CRS_DV_GPIO_Port    GPIOA
#define RMII_RXD0_Pin            GPIO_PIN_4
#define RMII_RXD0_GPIO_Port      GPIOC
#define RMII_RXD1_Pin            GPIO_PIN_5
#define RMII_RXD1_GPIO_Port      GPIOC
#define RMII_TX_EN_Pin           GPIO_PIN_11
#define RMII_TX_EN_GPIO_Port     GPIOB
#define RMII_TXD0_Pin            GPIO_PIN_12
#define RMII_TXD0_GPIO_Port      GPIOB
#define RMII_TXD1_Pin            GPIO_PIN_13
#define RMII_TXD1_GPIO_Port      GPIOB
#define PHY_RESET_Pin            GPIO_PIN_0
#define PHY_RESET_GPIO_Port      GPIOB
#define PHY_INT_Pin              GPIO_PIN_2
#define PHY_INT_GPIO_Port        GPIOC

/* ------------- FLOW SENSOR (Pulse Input) ------------- */
#define FLOW_PULSE_Pin           GPIO_PIN_15
#define FLOW_PULSE_GPIO_Port     GPIOA     // TIM2_CH1 (input capture)

/* ------------- SAFETY INPUTS ------------- */
#define EMG_STOP_Pin             GPIO_PIN_10
#define EMG_STOP_GPIO_Port       GPIOC
#define SAFETY_FEEDBACK_Pin      GPIO_PIN_11
#define SAFETY_FEEDBACK_GPIO_Port GPIOC

/* ------------- DEBUG (SWD) ------------- */
#define SWDIO_Pin                GPIO_PIN_13
#define SWDIO_GPIO_Port          GPIOA
#define SWCLK_Pin                GPIO_PIN_14
#define SWCLK_GPIO_Port          GPIOA
#define SWO_Pin                  GPIO_PIN_3
#define SWO_GPIO_Port            GPIOB

/* ========================== MACROS ============================== */
#define ON  1
#define OFF 0
#define TRUE 1
#define FALSE 0

/* ========================== FUNCTION PROTOTYPES ================= */
void Error_Handler(void);

/* ========================== ASSERT PARAMS ======================= */
#ifdef  USE_FULL_ASSERT
void assert_failed(uint8_t *file, uint32_t line);
#endif

#ifdef __cplusplus
}
#endif

#endif /* __MAIN_H */
