---
layout: post
comments: true
title: Quantum computing
tags: ["Random thoughts"]
tagline: A brief introduction to the basics of quantum computing.
---
<script>
  import Math from "$lib/Math.svelte";
</script>

<small> Originally posted at: [https://amshasblog.wordpress.com/2016/08/16/quantum-computing/](https://amshasblog.wordpress.com/2016/08/16/quantum-computing/) </small>

As part of my undergrad I did a seminar on quantum computing. Here I outline the basics of Quantum Computing I have learnt so far. Note that I am only explaining quantum computing from a Computer Science (mathematical) perspective.

Before I further proceed, lets take a dive into some of the related terminology. The fundamental unit of information in modern computers is a `bit`. In the context of quantum computing, the modern computers will be referred to as the classical computer, and the `bit` on which the classical computing model is built will be referred to as a classical bit. The classical computers perform computations by manipulating these bits, using logic gate, which we will be calling classical gates in this case. Similarly in a quantum computer, the quantum bit more commonly known as a qubit is the analogous entity of a classical bit. computation is performed by manipulating these qubits using, what is referred to as, quantum gates.

## Qubit
<p>
A classical bit can take one of two states, <Math eqn="1"/> and <Math eqn="0"/>. Now, a qubit, is a two state quantum system. The two states are similar to that of the classical bit's, but a qubit does not have to be in just one of those states. Before diving further into that, let’s take a look at how the state of a qubit can be represented. It is represented using ket notation (<Math eqn=" |\psi\rangle"/>), from the bra-ket notation (<Math eqn="\langle\phi|\psi\rangle"/> ), as any other quantum state. That is, the state of the qubit can be represented using a two-dimensional complex state vector,
</p>
<p style="text-align:center">
<Math eqn="|\psi\rangle = \left(\begin&lcub;matrix&rcub;\alpha\\ \beta\end&lcub;matrix&rcub;\right)"/>
</p>
<p>
where <Math eqn="\alpha"/> and <Math eqn="\beta"/> are complex coordinates (think of it as a vactor of size 2). The basis states (basis vectors) of a qubit are <Math eqn="|0\rangle"/> and <Math eqn="|1\rangle"/>, which can be represented as follows.
</p>
<p style="text-align:center">
<Math eqn="|0\rangle = \left(\begin&lcub;matrix&rcub;1\\ 0\end&lcub;matrix&rcub;\right)"/>&emsp;&emsp;&emsp;<Math eqn="|1\rangle = \left(\begin&lcub;matrix&rcub;0\\ 1\end&lcub;matrix&rcub;\right)"/>
</p>
<p>These two basis states are analogous to the binary states of the classical bit. As said before a qubit can be in either of these states, or be in a state between these two. This can be written as a linear combination of these two states. This is what is known as a superposition. In quantum mechanics, two quantum states added together, i.e. “superposed”, is also a valid quantum state. Hence, we can represent the state of a qubit with the following linear equation.</p>

<p style="text-align:center"><Math eqn="|\psi\rangle = \alpha |0\rangle + \beta |1\rangle"/></p>

<p>Where <Math eqn="\alpha"/> and <Math eqn="\beta"/> are complex numbers, which are the probability amplitudes of the <Math eqn="|0\rangle"/> state and <Math eqn="|1\rangle"/> state, in the state represented by <Math eqn="|\psi\rangle"/>. Or in other words, the probability of the qubit, represented by the state <Math eqn="|\psi\rangle"/>, being in the basis state <Math eqn="|0\rangle"/> would be <Math eqn="|\alpha|^2"/> and the probability of it being in the basis state <Math eqn="|1\rangle"/> would be <Math eqn="|\beta|^2"/>. As we are dealing with probabilities, naturally, the following must always hold.</p>

<p style="text-align:center"><Math eqn="|\alpha|^2 + |\beta|^2 = 1"/></p>

<p>In a classical system with <Math eqn="n"/> bits, the state of thee system can be represented using <Math eqn="n"/> bits(digits). But, as seen above, in order to describe a qubit, we need two complex numbers, or in other terms, since a single qubit system has two basis states we need a complex number to represent the probability it could be in each of those basis states. Similarly, a two qubit system has four basis states, and a three qubit system has eight basis states, requiring four complex numbers and eight complex numbers respectively to represent the state they can be in. That is to say, to describe a quantum system with <Math eqn="n"/> qubits, we need <Math eqn="2^n"/> complex numbers. To further elaborate, lets see how a two qubit system can be represented.</p>

<p style="text-align:center"><Math eqn="|\psi\rangle = \alpha |00\rangle + \beta |01\rangle + \delta |10\rangle + \gamma |11\rangle"/></p>

Where,

<p style="text-align:center"><Math eqn="|\alpha|^2 +|\beta|^2 +|\delta|^2 +|\gamma|^2 = 1"/></p>

<p>The basis state vectors of the above two qubit system would be <Math eqn="|00\rangle"/>, <Math eqn="|01\rangle"/>, <Math eqn="|10\rangle"/>, and <Math eqn="|11\rangle"/>.</p>

<p>Even though much higher number of digits are needed to represent the state of a qubit, it does not mean that we can store more information using a qubit. The reason for that is the effect of measurement in a quantum system. When we measure a quantum system which could be in a superposition of states, it will collapse to one of the states. Consider a qubit in the state <Math eqn="\alpha|0\rangle + \beta |1\rangle"/>. When this qubits state is measured, it will collapse to either of the states <Math eqn="|0\rangle"/> or <Math eqn="|1\rangle"/>. The probability of it collapsing to either state will be <Math eqn="|\alpha|^2"/> and <Math eqn="|\beta|^2"/> respectively. Similarly a two qubit system would collapse to one of the four basis states with the probability of collapsing to a particular state being the squared magnitude of it’s coefficient.</p>

## Quantum Gates
<p>Now that we have established how we can represent qubits, let us move to how we can use the qubit(s) to perform computation. In a classical computer, computations are performed by setting bits in the system to an initial state, and applying a sequence of logical gates to manipulate the bits to obtain the final state. Similarly in a qubit system, we need to define how to perform such manipulations to the qubits to perform computations. Since qubits can be represented as vectors, manipulating the states of the qubits can be expressed using transformations, which can be represented using matrices. Simply put, quantum gates can be represented using matrices.</p>

<p>As discussed earlier, the summation of the squared magnitude of the probability amplitudes of a state must equal to one. Hence, we can intuitively say that any transformation applied to a qubit system must preserve this. It can be further elaborated as the transformation applied must preserve the length of the state vector. The matrix that represents such a transformation would be a unitary matrix. For example the Hadamard gate <Math eqn="H"/>, which can be represented using the following matrix,</p>

<p style="text-align:center"><Math eqn="H = ^1/_&lcub;\sqrt&lcub;2&rcub;&rcub; \left[\begin&lcub;matrix&rcub; 1 & 1 \\ 1 & -1\end&lcub;matrix&rcub;\right]"/></p>

<p>is a single quibit gate. If it were to be applied to a qubit in the state <Math eqn="|\psi\rangle = \alpha |0\rangle + \beta |1\rangle"/>, which can be represented using the vector <Math eqn="\left[ \begin&lcub;matrix&rcub; \alpha \\ \beta \end&lcub;matrix&rcub; \right]"/>, it can be expressed using simple matrix multiplication as follows,</p>

<p style="text-align:center"><Math eqn="H |\psi\rangle = ^1/_&lcub;\sqrt&lcub;2&rcub;&rcub; \left[\begin&lcub;matrix&rcub;1&1\\1&-1\end&lcub;matrix&rcub;\right]\left[ \begin&lcub;matrix&rcub;\alpha \\ \beta\end&lcub;matrix&rcub;\right]"/> </p>

Thus,

<p style="text-align:center"><Math eqn="H |\psi\rangle = ^1/_&lcub;\sqrt&lcub;2&rcub;&rcub; \left[ \begin&lcub;matrix&rcub;\alpha + \beta \\ \alpha -\beta\end&lcub;matrix&rcub;\right]"/></p>

Which can be written as,

<p style="text-align:center"><Math eqn="H|\psi\rangle = \frac&lcub;\alpha + \beta&rcub;&lcub;\sqrt&lcub;2&rcub;&rcub; |0\rangle + \frac&lcub;\alpha - \beta&rcub;&lcub;\sqrt&lcub;2&rcub;&rcub; |1\rangle"/></p>

<p><Math eqn="H"/> is a unitary matrix, i.e. <Math eqn="HH^* = I"/>, where <Math eqn="I"/> is an identity matrix and <Math eqn="H^*"/> is the conjugate transpose of <Math eqn="H"/>. As it can be seen, a gate that works on <Math eqn="k"/> qubits can be represented using a <Math eqn="2^k \times 2^k"/> matrix. Some of the gates can be seen in the following table. Note that I ave not discussed the involvement of <Math eqn="\phi"/> and <Math eqn="i"/> in this article.</p>

<table>
	<thead>
		<tr>
			<th>Name of Gate</th> 
			<th>Matrix Representation</th>	
			<th>Operation on Initial states</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Hadamard Gate</td>
			<td><Math eqn="H = ^1\!/_&lcub;\!\sqrt&lcub;2&rcub;&rcub;\left[\begin&lcub;matrix&rcub;1&1\\1&-1\end&lcub;matrix&rcub;\right]"/></td>
			<td><Math eqn="|0\rangle"/> to <Math eqn="\frac&lcub;|0\rangle + |1\rangle&rcub;&lcub;\sqrt&lcub;2&rcub;&rcub;"/> ,&emsp; <Math eqn="|1\rangle"/> to <Math eqn="\frac&lcub;|0\rangle - |1\rangle&rcub;&lcub;\sqrt&lcub;2&rcub;&rcub;"/></td>
		</tr>
		<tr>
			<td>Pauli X-gate</td>	
			<td><Math eqn="X = \left[\begin&lcub;matrix&rcub;0&1\\1&0\end&lcub;matrix&rcub;\right]"/></td>	
			<td><Math eqn="|0\rangle"/> to <Math eqn="|1\rangle"/> ,&emsp; <Math eqn="|1\rangle"/> to <Math eqn="|0\rangle"/> (analogous to classical NOT gate) </td>
		</tr>
		<tr>
			<td>Pauli Y-gate</td>	
			<td><Math eqn="Y = \left[\begin&lcub;matrix&rcub;0&i\\-i&0\end&lcub;matrix&rcub;\right]"/></td>
			<td><Math eqn="|0\rangle"/> to <Math eqn="i |1\rangle"/> ,&emsp; <Math eqn="|1\rangle"/> to <Math eqn="-i|0\rangle"/></td>
		</tr>
		<tr>
			<td>Pauli Z-gate</td>
			<td><Math eqn="Z = \left[\begin&lcub;matrix&rcub;1&0\\1&-1\end&lcub;matrix&rcub;\right]"/></td>
			<td><Math eqn="|0\rangle"/> unchanged ,&emsp; <Math eqn="|1\rangle"/> to <Math eqn="-|1\rangle"/></td>
		</tr>
		<tr>
			<td>Phase shift gate</td>
			<td><Math eqn="Y = \left[\begin&lcub;matrix&rcub;1&0\\1&e^&lcub;i\phi&rcub;\end&lcub;matrix&rcub;\right]"/></td>
			<td><Math eqn="|0\rangle"/> unchanged, &emsp;<Math eqn="|1\rangle"/> to <Math eqn="e^&lcub;i\phi&rcub;|1\rangle"/></td>
		</tr>
		<tr>
			<td>Control NOT gate</td>
			<td>CNOT = <Math eqn="\left[\begin&lcub;matrix&rcub;1&0&0&0\\0&1&0&0\\0&0&0&1\\0&0&1&0\end&lcub;matrix&rcub;\right]"/></td>
   			<td>NOT operation on second qubit only if the first qubit is in state <Math eqn="|1\rangle"/></td>
		</tr>
	</tbody>
</table>

In classical computers the NAND gate is known as the universal gate, also the AND gate and the NOT gate in classical computing can be shown to be universal, i.e. they can be used to build any logical circuit. Similarly for a quantum system such gate(s) can be shown to be universal. The Hadamard gate, <Math eqn="R_&lcub;^\pi/_4&rcub;"/> gate (phase shift gate with <Math eqn="\phi =  ^\pi /_4"/> ), which are single qubit gates, together with the control-NOT(cNOT) gate can be known as universal, as any quantum circuit can be built from them.

## Entanglement

<p>An important distinguishing feature between a qubit and a classical bit is that multiple qubits can exhibit quantum entanglment. Take, for example, the bell state, <Math eqn="^1/_&lcub;\!\sqrt&lcub;2&rcub;&rcub; (|00\rangle + |11\rangle)"/>, which can be obtained from the inital state <Math eqn="|00\rangle"/>, and apply the Hadamard gate to one qubit and then apply the cNOT gate. The probability of the states <Math eqn="|00\rangle"/> or <Math eqn="|11\rangle"/> is <Math eqn="|^1/_&lcub;\sqrt&lcub;2&rcub;&rcub;|^2 = ^1/_2"/>. This state cannot be obtained by any combination of classical bits, i.e. we cannot obtain this state by arranging a set of qubits. That is to say, this state can be achieved only by applying a set of quantum gates. And this state exists only when both the qubits are together, and they don’t have a definite state on their own. To further elaborate on that, consider a two qubit placed to gether, hence</p>

<p style="text-align:center"><Math eqn="|\psi\rangle = (\alpha |0\rangle + \beta |1\rangle)(\delta |0\rangle + \gamma |1\rangle)"/></p>

Thus,

<p style="text-align:center"><Math eqn="|\psi\rangle = \alpha\delta |00\rangle + \alpha\gamma |01\rangle + \beta\delta |10\rangle + \beta\gamma|11\rangle"/></p>

<p>for this system, whose state is represented by <Math eqn="|\psi\rangle"/>, to be in the bell state, the following should hold,</p>

<p style="text-align:center"><Math eqn="\alpha\delta = ^1/_&lcub;\sqrt&lcub;2&rcub;&rcub;"/> ,  <Math eqn="\quad\alpha\gamma = 0"/> , <Math eqn="\quad\beta\delta = 0 "/>,  <Math eqn="\quad\beta\gamma =^1/_&lcub;\sqrt&lcub;2&rcub;&rcub;"/></p>

<p>This does not have a solution. Such a state obtained by applying quantum gates are known as entangled states.</p>

<p>As described above, such entangled states are unique to quantum computing. It is entanglement that makes quantum computing stand out from the classical computing models. Such entangled states can be used as shortcuts to perform certain calculations. In fact it can be shown that a quantum computation that does not utilize entangled states can be effectively simulated using classical computing. For certain problems, such as integer factorization, quantum algorithms(algorithms that use quantum phenomena such as entangled states) have been developed which are faster than any classical algorithm.</p>


