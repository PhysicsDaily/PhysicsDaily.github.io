# Chapter 2: Motion Along a Straight Line

## Learning Objectives

After studying this chapter, you will be able to:

- Define displacement, velocity, and acceleration
- Derive and apply kinematic equations
- Analyze motion with constant acceleration
- Solve free-fall problems

---

## 2.1 Displacement and Velocity

### Displacement

**Displacement** is the change in position:

$$\Delta x = x_2 - x_1$$

!!! warning "Displacement ≠ Distance"
    Displacement is a vector (has direction). Distance is the total path length traveled (always positive).

### Average Velocity

$$v_{avg} = \frac{\Delta x}{\Delta t} = \frac{x_2 - x_1}{t_2 - t_1}$$

### Instantaneous Velocity

$$v = \lim_{\Delta t \to 0} \frac{\Delta x}{\Delta t} = \frac{dx}{dt}$$

---

## 2.2 Acceleration

### Average Acceleration

$$a_{avg} = \frac{\Delta v}{\Delta t} = \frac{v_2 - v_1}{t_2 - t_1}$$

### Instantaneous Acceleration

$$a = \frac{dv}{dt} = \frac{d^2x}{dt^2}$$

!!! tip "Signs Matter!"
    - Positive acceleration doesn't always mean speeding up
    - If $v$ and $a$ have the **same sign** → speeding up
    - If $v$ and $a$ have **opposite signs** → slowing down

---

## 2.3 Constant Acceleration: Kinematic Equations

When acceleration is constant, we have four key equations:

<div class="important-equation">

$$v = v_0 + at$$

$$x = x_0 + v_0 t + \frac{1}{2}at^2$$

$$v^2 = v_0^2 + 2a(x - x_0)$$

$$x - x_0 = \frac{1}{2}(v_0 + v)t$$

</div>

### Choosing the Right Equation

| Known | Unknown | Use Equation |
|-------|---------|--------------|
| $v_0, a, t$ | $v$ | $v = v_0 + at$ |
| $v_0, a, t$ | $x$ | $x = x_0 + v_0 t + \frac{1}{2}at^2$ |
| $v_0, a, x$ | $v$ | $v^2 = v_0^2 + 2a(x - x_0)$ |
| $v_0, v, t$ | $x$ | $x - x_0 = \frac{1}{2}(v_0 + v)t$ |

---

## 2.4 Free Fall

An object in **free fall** experiences only gravitational acceleration:

$$a = -g = -9.8 \text{ m/s}^2$$

(negative because downward, if we take up as positive)

!!! note "Key Insight"
    All objects fall with the same acceleration regardless of mass (in the absence of air resistance). This was famously demonstrated by Galileo.

### Free-Fall Equations

Setting $a = -g$:

$$v = v_0 - gt$$

$$y = y_0 + v_0 t - \frac{1}{2}gt^2$$

$$v^2 = v_0^2 - 2g(y - y_0)$$

---

## 2.5 Graphical Analysis of Motion

### Position-Time Graph ($x$ vs $t$)

- Slope = velocity
- Curved line = acceleration present

### Velocity-Time Graph ($v$ vs $t$)

- Slope = acceleration
- Area under curve = displacement

### Acceleration-Time Graph ($a$ vs $t$)

- Area under curve = change in velocity

---

## Worked Example

!!! example "Problem: A Car Stopping"
    A car traveling at 25 m/s applies brakes and decelerates at 5.0 m/s². How far does it travel before stopping?
    
    **Given:**
    
    - $v_0 = 25$ m/s
    - $v = 0$ (car stops)
    - $a = -5.0$ m/s² (negative because decelerating)
    
    **Find:** $\Delta x = ?$
    
    **Solution:**
    
    Use: $v^2 = v_0^2 + 2a\Delta x$
    
    $$0 = (25)^2 + 2(-5.0)\Delta x$$
    
    $$\Delta x = \frac{625}{10} = 62.5 \text{ m}$$

---

## Summary

!!! abstract "Key Equations"
    | Quantity | Definition |
    |----------|------------|
    | Velocity | $v = \frac{dx}{dt}$ |
    | Acceleration | $a = \frac{dv}{dt}$ |
    | Free-fall acceleration | $g = 9.8$ m/s² |

---

## Practice Problems

??? question "Problem 1: Acceleration"
    A car accelerates from rest to 30 m/s in 6 seconds. What is its acceleration?
    
    ??? success "Solution"
        $$a = \frac{v - v_0}{t} = \frac{30 - 0}{6} = 5.0 \text{ m/s}^2$$

??? question "Problem 2: Free Fall"
    A ball is dropped from a height of 45 m. How long does it take to reach the ground?
    
    ??? success "Solution"
        Using $y = y_0 + v_0 t - \frac{1}{2}gt^2$ with $y = 0$, $y_0 = 45$ m, $v_0 = 0$:
        
        $$0 = 45 - \frac{1}{2}(9.8)t^2$$
        
        $$t^2 = \frac{90}{9.8} = 9.18$$
        
        $$t = 3.03 \text{ s}$$

---

[← Previous: Units & Vectors](units-physical-quantities.md) | [Next: Motion in 2D/3D →](motion-2d-3d.md)
