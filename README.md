# Drag Exercise

## Purpose

This was a project I started in anticipation of doing a conversion of a desktop application to a web-based one. It is a mechanism to create 8-second strips from a larger amount of ECG (heart signal).

The ECG signal is faked, and this doesn't represent any real-life individual.

## Usage

Click and drag anywhere in the closeup view to change what is showing in that view, and note that the indicator in the full disclosure updates to reflect what is showing in the close-up. Also note that the time stamp changes to reflect the beginning of the strip.

Control-click on the closeup view to create a strip selection. In some browsers, creating the strip will give you an interface to insert comments, and to save the strip. Until the strip is saved, click and drag on it to move it. Once it is saved, it is locked in place. Click the "X" box in the upper left to erase the strip, whether or not it has been saved.

Alt-click-drag on the closeup view to create a pair of calipers to measure the distance between beats and yield a heart rate. Once instantiated, you can click and drag on either end of the calipers to reposition them. The milliseconds measurement and derived heart rate updates live as you move the caliper. You can create multiple calipers; each has its own close box.

## Incomplete areas

The tabbed interface at the bottom is for show, as is the strip list to the left. This is a front end proof-of-concept only: there is not back end, and you cannot actually save strips that appear in the list.
