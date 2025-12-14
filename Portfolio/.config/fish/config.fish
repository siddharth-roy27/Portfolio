if status is-interactive
    # Commands to run in interactive sessions can go here
end
zoxide init fish | source
zoxide init fish | source
# Load ROS 2 environment
bass source /opt/ros/humble/setup.bash
bass source ~/ros2_ws/install/setup.bash

# FNM (Fast Node Manager)
set -gx PATH $HOME/.fnm $PATH
fnm env --use-on-cd | source
