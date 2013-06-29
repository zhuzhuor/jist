#!/usr/bin/env python

import subprocess
import time
import sys
import os

# http://goo.gl/2wtRL
# os.chdir(os.path.dirname(sys.argv[0]))
if os.path.dirname(sys.argv[0]) != '':
    os.chdir(os.path.dirname(sys.argv[0]))

print 'PhantomJS',
try:
    version = subprocess.check_output(['phantomjs', '--version'])
    print version
except Exception as exp:
    print 'is not installed.'
    print 'Please install it and try again.'
    sys.exit(-1)


server_process = None


def start_server():
    global server_process
    print 'To start the server, and wait for 10 seconds to set up...'
    server_process = subprocess.Popen(['dev_appserver.py', '..'])
    time.sleep(10)


def stop_server():
    time.sleep(1)
    print 'To stop the server...',
    server_process.terminate()
    server_process.wait()
    print 'done.'


# http://goo.gl/xaBer
def red_alert(text):
    print "\033[7;31m" + text + "\033[0m"


def run_all_tests():
    print
    print 'To run all test-*.js files...'
    num_failed = 0
    num_passed = 0
    for file_name in os.listdir('.'):
        if file_name.startswith('test-') and file_name.endswith('.js'):
            command = ['phantomjs', file_name]
            print
            print ' '.join(command)
            return_value = subprocess.call(command)
            time.sleep(2)  # sleep 2 seconds between tests
            if return_value != 0:
                num_failed += 1
                red_alert(file_name + ' FAILED!')
            else:
                num_passed += 1
                print file_name + ' passed.'
    print
    if num_failed > 0:
        red_alert('Final results: ' + str(num_failed) + ' TESTS FAILED'
                  + ' (out of ' + str(num_failed + num_passed) + ')')
    else:
        print 'All %d tests passed.' % (num_passed + num_failed)
    print
    return num_failed


if __name__ == '__main__':
    exit_code = -1
    try:
        start_server()
        exit_code = run_all_tests()
    finally:
        stop_server()
    sys.exit(exit_code)
